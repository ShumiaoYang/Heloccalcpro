import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { generateHelocPdf } from '@/lib/pdf/generator';
import { analyzeHeloc } from '@/lib/ai/analyzer';
import { saveLocalPdf } from '@/lib/storage/local-storage';
import { triggerBackgroundTasks } from '@/lib/tasks/background-tasks';
import { generateAccessToken } from '@/lib/pdf/token-manager';
import type { PdfData } from '@/lib/pdf/types';
import type { CalculatedData } from '@/types/heloc-ai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    const { calculationId, email } = session.metadata!;

    try {
      // Check if PDF already exists (intelligent duplicate check)
      const existingPurchase = await prisma.pdfPurchase.findFirst({
        where: {
          calculationId,
          email,
          status: 'COMPLETED',
        },
      });

      if (existingPurchase && existingPurchase.pdfGeneratedAt) {
        console.log('[Webhook] PDF already generated, skipping generation');

        // Update payment ID only
        await prisma.pdfPurchase.updateMany({
          where: {
            stripeSessionId: session.id,
          },
          data: {
            stripePaymentId: session.payment_intent as string,
            status: 'COMPLETED',
          },
        });

        console.log(`[Webhook] Payment completed for ${email}, PDF already exists`);
        return NextResponse.json({ received: true, skipped: true });
      }

      // Update purchase record to PROCESSING
      await prisma.pdfPurchase.updateMany({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          stripePaymentId: session.payment_intent as string,
          status: 'PROCESSING',
        },
      });

      // Generate PDF directly in webhook (fast, local storage)
      console.log('[Webhook] Starting PDF generation...');

      try {
        // Fetch calculation data
        const calculation = await prisma.helocCalculation.findUnique({
          where: { id: calculationId },
        });

        if (!calculation) {
          throw new Error('Calculation not found');
        }

        const inputs = calculation.inputs as any;

        // Generate or retrieve AI analysis
        let aiAnalysis = calculation.aiAnalysisRaw as any;

        if (!aiAnalysis) {
          console.log('[Webhook] Generating AI analysis...');

          const calculatedData: CalculatedData = inputs.calculatedData || {
            scenario: inputs.scenario || 'DEBT_CONSOLIDATION',
            coreMetrics: {
              maxLimit: inputs.calculatedData?.coreMetrics?.maxLimit || 0,
              helocRate: inputs.calculatedData?.coreMetrics?.helocRate || 9,
              cltv: inputs.calculatedData?.coreMetrics?.cltv || 0,
              dti: inputs.calculatedData?.coreMetrics?.dti || 0,
              monthlySavings: inputs.calculatedData?.coreMetrics?.monthlySavings || 0,
            },
            scenarioMetrics: inputs.calculatedData?.scenarioMetrics || {},
          };

          try {
            aiAnalysis = await analyzeHeloc(calculatedData, inputs);
            await prisma.helocCalculation.update({
              where: { id: calculationId },
              data: { aiAnalysisRaw: aiAnalysis as any },
            });
          } catch (error) {
            console.error('[Webhook] AI analysis failed, using fallback');
            aiAnalysis = {
              summary: `Based on your HELOC scenario, your maximum limit is estimated at $${calculatedData.coreMetrics.maxLimit.toLocaleString()}.`,
              diagnostic: `Your CLTV is ${calculatedData.coreMetrics.cltv}% and DTI is ${calculatedData.coreMetrics.dti}%.`,
              strategy: 'Consult with a financial advisor for personalized guidance.',
              actionPlan: ['Review financial position', 'Contact advisor', 'Compare lenders'],
              tips: [{ type: 'info', content: 'AI analysis temporarily unavailable.' }],
            };
          }
        }

        // Prepare PDF data
        const pdfData: PdfData = {
          userInputs: inputs,
          calculatedData: {
            scenario: inputs.scenario || 'debt_consolidation',
            coreMetrics: {
              maxLimit: inputs.calculatedData?.coreMetrics?.maxLimit || 0,
              helocRate: inputs.calculatedData?.coreMetrics?.helocRate || 5,
              cltv: inputs.calculatedData?.coreMetrics?.cltv || 0,
              dti: inputs.calculatedData?.coreMetrics?.dti || 0,
              monthlySavings: inputs.calculatedData?.coreMetrics?.monthlySavings || 0,
            },
            scenarioMetrics: inputs.calculatedData?.scenarioMetrics || {},
          },
          aiAnalysis,
          generatedAt: new Date(),
          userInfo: email ? { email } : undefined,
        };

        // Generate PDF buffer
        console.log('[Webhook] Generating PDF buffer...');
        const pdfBuffer = await generateHelocPdf(pdfData);

        // Save to local storage
        console.log('[Webhook] Saving to local storage...');
        const localPath = await saveLocalPdf(pdfBuffer, calculationId);
        console.log('[Webhook] Saved locally:', localPath);

        // Find purchase record
        const purchase = await prisma.pdfPurchase.findFirst({
          where: { calculationId, email },
        });

        if (!purchase) {
          throw new Error('Purchase record not found');
        }

        // Generate access token
        const { token, expiresAt } = generateAccessToken(
          purchase.id,
          email,
          calculationId
        );

        // Update purchase record with COMPLETED status
        await prisma.pdfPurchase.update({
          where: { id: purchase.id },
          data: {
            pdfUrl: `/api/heloc/download-pdf?token=${token}`,
            pdfGeneratedAt: new Date(),
            status: 'COMPLETED',
            accessToken: token,
            tokenExpiresAt: expiresAt,
          },
        });

        console.log('[Webhook] Database updated, status: COMPLETED');

        // Trigger background tasks (R2 upload + email)
        console.log('[Webhook] Triggering background tasks...');
        triggerBackgroundTasks(calculationId, email, pdfBuffer);

        console.log('[Webhook] PDF generated successfully');
      } catch (error) {
        console.error('[Webhook] PDF generation failed:', error);

        // Update status to FAILED
        await prisma.pdfPurchase.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: 'FAILED' },
        });
      }

      console.log(`[Webhook] Payment completed for ${email}, calculation ${calculationId}`);
    } catch (error) {
      console.error('[Webhook] Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
