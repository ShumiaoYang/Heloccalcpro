import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { generateHelocPdf } from '@/lib/pdf/generator';
import { analyzeHeloc } from '@/lib/ai/analyzer';
import { uploadPdfToR2, getSignedDownloadUrl } from '@/lib/storage/r2-client';
import { sendPdfDownloadEmail } from '@/lib/email/mailer';
import { generateAccessToken } from '@/lib/pdf/token-manager';
import { getLivePrimeRate, getBaseMargin } from '@/lib/heloc/rate-service';
import type { PdfData } from '@/lib/pdf/types';
import type { CalculatedData } from '@/types/heloc-ai';

function shouldRegenerateAiAnalysis(aiAnalysis: any): boolean {
  if (!aiAnalysis) return true;

  const text = [aiAnalysis.summary, aiAnalysis.diagnostic, aiAnalysis.strategy]
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .join(' ');

  if (!text) return true;

  const nonAsciiCount = (text.match(/[^\x20-\x7E]/g) || []).length;
  return (nonAsciiCount / Math.max(text.length, 1)) > 0.18;
}

// Check if mock mode is enabled
const stripeMockMode = process.env.STRIPE_MOCK_MODE === 'true';

// 初始化Stripe (only if not in mock mode)
const stripe = stripeMockMode ? null : new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      calculationData,
      calculatedData,
      // Step 1 data
      amountNeeded,
      scenario,
      renovationDuration,
      renovationType,
      // Step 2 data
      homeValue,
      mortgageBalance,
      creditScore,
      annualIncome,
      monthlyDebt,
      propertyType,
      occupancy,
      subjectHousingPayment,
      otherMonthlyDebt,
      // Step 3 data
      creditCardLimit,
      creditCardBalance,
    } = await req.json();

    console.log('=== Checkout API Called ===');
    console.log('Email:', email);

    // 检查环境变量
    console.log('STRIPE_SECRET_KEY loaded:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length);
    console.log('STRIPE_SECRET_KEY prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 20));

    // Validate input
    if (!email || !calculationData) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save calculation record to database with extended data
    console.log('Step 1: Saving calculation to database...');
    const calculation = await prisma.helocCalculation.create({
      data: {
        inputs: {
          ...calculationData.inputs,
          // Step 1 data
          amountNeeded,
          scenario,
          renovationDuration,
          renovationType,
          // Step 2 data
          homeValue,
          mortgageBalance,
          creditScore,
          annualIncome,
          monthlyDebt,
          propertyType,
          occupancy,
          subjectHousingPayment,
          otherMonthlyDebt,
          // Step 3 data
          creditCardLimit,
          creditCardBalance,
          // Calculated data
          calculatedData,
        },
        results: calculationData.results,
      },
    });
    console.log('Calculation saved with ID:', calculation.id);

    // 2. Check free promo eligibility (First 50 users)
    console.log('Step 2: Checking free promo eligibility...');
    const freePromoCount = await prisma.pdfPurchase.count({
      where: { isFreePromo: true },
    });
    console.log('Free promo count:', freePromoCount);

    const isFreePromoEligible = freePromoCount < 50;

    if (isFreePromoEligible) {
      console.log('[FREE PROMO] User is eligible! Skipping Stripe...');

      // Create free purchase record
      const freePurchase = await prisma.pdfPurchase.create({
        data: {
          email,
          stripeSessionId: `free_promo_${Date.now()}_${calculation.id}`,
          stripePaymentId: `free_promo_${calculation.id}`,
          calculationId: calculation.id,
          amount: 0,
          status: 'PENDING',
          isFreePromo: true,
        },
      });

      // Generate PDF immediately
      console.log('[FREE PROMO] Triggering PDF generation...');
      generatePdfInBackground(calculation.id, email, calculatedData).catch(error => {
        console.error('[FREE PROMO] PDF generation failed:', error);
      });

      return NextResponse.json({
        isFreePromo: true,
        message: 'Congratulations! You are one of the first 50 Product Hunt users.',
        purchaseId: freePurchase.id
      });
    }

    // 3. Create Stripe Checkout Session (or mock session)
    console.log('Step 3: Creating Checkout Session...');
    console.log('Mock Mode:', stripeMockMode);
    console.log('Using Price ID:', process.env.STRIPE_PRICE_HELOC_REPORT);

    let session: { id: string; url: string | null };

    if (stripeMockMode) {
      // Mock mode: Create a fake session
      console.log('[MOCK MODE] Creating mock checkout session');
      const mockSessionId = `mock_cs_${Date.now()}_${calculation.id}`;
      session = {
        id: mockSessionId,
        url: `${process.env.APP_DOMAIN}/en/heloc/payment/success?session_id=${mockSessionId}`,
      };
      console.log('[MOCK MODE] Mock session created:', session.id);
    } else {
      // Real Stripe mode
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }
      console.log('Creating real Stripe Checkout Session...');
      console.log('Success URL:', `${process.env.APP_DOMAIN}/en/heloc/payment/success?session_id={CHECKOUT_SESSION_ID}`);

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_HELOC_REPORT!,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_DOMAIN}/en/heloc/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_DOMAIN}/en/heloc/payment/cancel`,
        customer_email: email,
        metadata: {
          calculationId: calculation.id,
          email,
        },
      });
      session = {
        id: stripeSession.id,
        url: stripeSession.url ?? null,
      };
      console.log('Stripe session created:', session.id);
    }

    // 4. Create pending purchase record
    await prisma.pdfPurchase.create({
      data: {
        email,
        stripeSessionId: session.id,
        stripePaymentId: `pending_${session.id}`, // 使用session.id确保唯一性
        calculationId: calculation.id,
        amount: 499,
        status: 'PENDING',
      },
    });

    // 5. In mock mode, trigger PDF generation immediately
    if (stripeMockMode) {
      console.log('[MOCK MODE] Triggering PDF generation in background...');

      // Generate PDF in background (don't block the response)
      generatePdfInBackground(calculation.id, email, calculatedData).catch(error => {
        console.error('[MOCK MODE] Background PDF generation failed:', error);
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Generate PDF in background (for mock mode)
 * This function runs asynchronously without blocking the checkout response
 */
async function generatePdfInBackground(
  calculationId: string,
  email: string,
  calculatedData: any
) {
  try {
    console.log('[PDF Generation] Starting for calculation:', calculationId);

    // Fetch calculation data
    const calculation = await prisma.helocCalculation.findUnique({
      where: { id: calculationId },
    });

    if (!calculation) {
      throw new Error('Calculation not found');
    }

    const inputs = calculation.inputs as any;
    const results = calculation.results as any;
    const fallbackHelocRate = (await getLivePrimeRate()) + getBaseMargin();

    // Generate AI analysis
    let aiAnalysis = calculation.aiAnalysisRaw as any;

    if (shouldRegenerateAiAnalysis(aiAnalysis)) {
      console.log('[PDF Generation] Generating AI analysis...');

      const calcData: CalculatedData = inputs.calculatedData || {
        scenario: inputs.scenario || 'DEBT_CONSOLIDATION',
        coreMetrics: {
          maxLimit: inputs.calculatedData?.coreMetrics?.maxLimit || 0,
          helocRate: inputs.calculatedData?.coreMetrics?.helocRate || fallbackHelocRate,
          cltv: inputs.calculatedData?.coreMetrics?.cltv || 0,
          dti: inputs.calculatedData?.coreMetrics?.dti || 0,
          monthlySavings: inputs.calculatedData?.coreMetrics?.monthlySavings || 0,
        },
        scenarioMetrics: inputs.calculatedData?.scenarioMetrics || {},
      };

      try {
        aiAnalysis = await analyzeHeloc(calcData, inputs);
        await prisma.helocCalculation.update({
          where: { id: calculationId },
          data: { aiAnalysisRaw: aiAnalysis as any },
        });
      } catch (error) {
        console.error('[PDF Generation] AI analysis failed, using fallback');
        aiAnalysis = {
          summary: `Based on your HELOC scenario, your maximum limit is estimated at $${calcData.coreMetrics.maxLimit.toLocaleString()}.`,
          diagnostic: `Your CLTV is ${calcData.coreMetrics.cltv}% and DTI is ${calcData.coreMetrics.dti}%.`,
          strategy: 'Consult with a financial advisor for personalized guidance.',
          actionPlan: ['Review financial position', 'Contact advisor', 'Compare lenders'],
          tips: [{ type: 'info', content: 'AI analysis temporarily unavailable.' }],
        };
      }
    }

    // Prepare PDF data
    // Use calculatedData from inputs (already calculated and saved by frontend)
    const pdfData: PdfData = {
      userInputs: inputs,
      calculatedData: {
        scenario: inputs.scenario || 'debt_consolidation',
        coreMetrics: {
          maxLimit: inputs.calculatedData?.coreMetrics?.maxLimit || 0,
          helocRate: inputs.calculatedData?.coreMetrics?.helocRate || fallbackHelocRate,
          cltv: inputs.calculatedData?.coreMetrics?.cltv || 0,
          dti: inputs.calculatedData?.coreMetrics?.dti || 0,
          monthlySavings: inputs.calculatedData?.coreMetrics?.monthlySavings || 0,
        },
        scenarioMetrics: inputs.calculatedData?.scenarioMetrics || {},
      },
      aiAnalysis,
      scenario: inputs.scenario,
      isMaxBorrowing: !inputs.amountNeeded || inputs.amountNeeded === 0,
      generatedAt: new Date(),
      userInfo: email ? { email } : undefined,
    };

    // Generate PDF
    console.log('[PDF Generation] Generating PDF buffer...');
    const pdfBuffer = await generateHelocPdf(pdfData);

    // Upload PDF to R2
    console.log('[PDF Generation] Uploading to R2...');
    const r2Key = `heloc-reports/heloc-report-${calculationId}.pdf`;
    await uploadPdfToR2(pdfBuffer, r2Key);

    // Generate signed download URL (24 hours expiry)
    console.log('[PDF Generation] Generating signed URL...');
    const signedUrl = await getSignedDownloadUrl(r2Key, 86400);

    // Find purchase record
    const purchase = await prisma.pdfPurchase.findFirst({
      where: {
        calculationId,
        email,
      },
    });

    if (!purchase) {
      throw new Error('Purchase record not found');
    }

    // Generate access token
    console.log('[PDF Generation] Generating access token...');
    const { token, expiresAt } = generateAccessToken(
      purchase.id,
      email,
      calculationId
    );

    // Update purchase record
    await prisma.pdfPurchase.update({
      where: { id: purchase.id },
      data: {
        r2Key,
        pdfUrl: signedUrl,
        pdfGeneratedAt: new Date(),
        status: 'COMPLETED',
        accessToken: token,
        tokenExpiresAt: expiresAt,
      },
    });

    // Send email with download link
    console.log('[PDF Generation] Sending email...');
    try {
      await sendPdfDownloadEmail({
        to: email,
        downloadUrl: signedUrl,
        calculationId,
        expiresIn: '7 days',
      });
      console.log('[PDF Generation] Email sent successfully');
    } catch (emailError) {
      console.error('[PDF Generation] Email send failed:', emailError);
    }

    console.log('[PDF Generation] Success! PDF URL:', signedUrl);
  } catch (error) {
    console.error('[PDF Generation] Failed:', error);
    throw error;
  }
}
