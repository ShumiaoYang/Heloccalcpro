import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateHelocPdf } from '@/lib/pdf/generator';
import { analyzeHeloc } from '@/lib/ai/analyzer';
import { saveLocalPdf } from '@/lib/storage/local-storage';
import { triggerBackgroundTasks } from '@/lib/tasks/background-tasks';
import { generateAccessToken } from '@/lib/pdf/token-manager';
import type { PdfData } from '@/lib/pdf/types';
import type { CalculatedData } from '@/types/heloc-ai';

export async function POST(req: NextRequest) {
  try {
    const { calculationId, email } = await req.json();

    if (!calculationId) {
      return NextResponse.json(
        { error: 'Missing calculationId' },
        { status: 400 }
      );
    }

    // Fetch calculation data from database
    const calculation = await prisma.helocCalculation.findUnique({
      where: { id: calculationId },
    });

    if (!calculation) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404 }
      );
    }

    const inputs = calculation.inputs as any;
    const results = calculation.results as any;

    // Check if AI analysis already exists
    let aiAnalysis = calculation.aiAnalysisRaw as any;

    // If no AI analysis, generate it
    if (!aiAnalysis) {
      console.log('Generating AI analysis...');

      // Extract calculated data from inputs (saved by frontend)
      const calculatedData: CalculatedData = inputs.calculatedData || {
        scenario: inputs.scenario || 'DEBT_CONSOLIDATION',
        coreMetrics: {
          maxLimit: inputs.calculatedData?.coreMetrics?.maxLimit || 0,
          helocRate: inputs.calculatedData?.coreMetrics?.helocRate || (inputs.primeRate + inputs.margin) || 9,
          cltv: inputs.calculatedData?.coreMetrics?.cltv || 0,
          dti: inputs.calculatedData?.coreMetrics?.dti || 0,
          monthlySavings: inputs.calculatedData?.coreMetrics?.monthlySavings || 0,
        },
        scenarioMetrics: inputs.calculatedData?.scenarioMetrics || {},
      };

      // Log for debugging
      console.log('Calculated data for AI:', JSON.stringify(calculatedData, null, 2));

      try {
        aiAnalysis = await analyzeHeloc(calculatedData, inputs);

        // Save AI analysis to database
        await prisma.helocCalculation.update({
          where: { id: calculationId },
          data: { aiAnalysisRaw: aiAnalysis as any },
        });
      } catch (error) {
        console.error('AI analysis failed:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));

        // Use fallback AI analysis with more helpful content
        aiAnalysis = {
          summary: `Based on your HELOC scenario, we've prepared a preliminary analysis. Your maximum HELOC limit is estimated at $${calculatedData.coreMetrics.maxLimit.toLocaleString()} with a CLTV of ${calculatedData.coreMetrics.cltv}% and DTI of ${calculatedData.coreMetrics.dti}%.`,
          diagnostic: `Your current CLTV ratio is ${calculatedData.coreMetrics.cltv}% (industry standard: 85%) and DTI ratio is ${calculatedData.coreMetrics.dti}% (bank threshold: 43%). ${calculatedData.coreMetrics.cltv > 85 ? 'Your CLTV exceeds the typical threshold.' : 'Your CLTV is within acceptable range.'} ${calculatedData.coreMetrics.dti > 43 ? 'Your DTI exceeds the typical threshold.' : 'Your DTI is within acceptable range.'}`,
          strategy: 'We recommend consulting with a financial advisor to develop a personalized strategy based on your specific financial situation and goals.',
          actionPlan: [
            'Review your current financial position and goals',
            'Contact a licensed financial advisor for personalized guidance',
            'Gather necessary documentation (income statements, property appraisal)',
            'Compare HELOC offers from multiple lenders'
          ],
          tips: [
            { type: 'info', content: 'AI-powered analysis is temporarily unavailable. This report contains basic calculations only.' },
            { type: 'info', content: 'For detailed insights, please try generating the report again later.' },
          ],
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

    // Generate PDF using new generator
    console.log('[PDF Generation] Generating PDF buffer...');
    const pdfBuffer = await generateHelocPdf(pdfData);

    // Save PDF to local storage (fast, immediate)
    console.log('[PDF Generation] Saving to local storage...');
    const localPath = await saveLocalPdf(pdfBuffer, calculationId);
    console.log('[PDF Generation] Saved locally:', localPath);

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

    // Update purchase record with local file info and COMPLETED status
    await prisma.pdfPurchase.update({
      where: { id: purchase.id },
      data: {
        pdfUrl: `/api/heloc/download-pdf?token=${token}`, // Local download URL
        pdfGeneratedAt: new Date(),
        status: 'COMPLETED',
        accessToken: token,
        tokenExpiresAt: expiresAt,
      },
    });

    console.log('[PDF Generation] Database updated, status: COMPLETED');

    // Trigger background tasks (R2 upload + email) without waiting
    console.log('[PDF Generation] Triggering background tasks...');
    triggerBackgroundTasks(calculationId, email, pdfBuffer);

    console.log('[PDF Generation] Success! Returning immediately');

    return NextResponse.json({
      success: true,
      pdfUrl: `/api/heloc/download-pdf?token=${token}`,
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
