/**
 * Background Tasks Manager
 * 后台任务管理器
 *
 * 用于异步处理PDF上传R2和邮件发送，不阻塞用户下载
 */

import { uploadPdfToR2, getSignedDownloadUrl } from '@/lib/storage/r2-client';
import { sendPdfDownloadEmail } from '@/lib/email/mailer';
import { deleteLocalPdf } from '@/lib/storage/local-storage';
import { prisma } from '@/lib/prisma';

/**
 * 延迟函数（用于重试间隔）
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的上传R2
 * @param buffer - PDF buffer
 * @param r2Key - R2对象key
 * @param maxRetries - 最大重试次数（默认3次）
 * @returns 是否上传成功
 */
async function uploadToR2WithRetry(
  buffer: Buffer,
  r2Key: string,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Background] Uploading to R2 (attempt ${attempt}/${maxRetries})...`);
      await uploadPdfToR2(buffer, r2Key);
      console.log(`[Background] R2 upload successful on attempt ${attempt}`);
      return true;
    } catch (error) {
      console.error(`[Background] R2 upload failed (attempt ${attempt}/${maxRetries}):`, error);

      if (attempt < maxRetries) {
        // 指数退避：2秒、4秒、8秒
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`[Background] Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  console.error(`[Background] R2 upload failed after ${maxRetries} attempts`);
  return false;
}

/**
 * 带重试的发送邮件
 * @param email - 收件人邮箱
 * @param downloadUrl - 下载链接
 * @param calculationId - 计算ID
 * @param maxRetries - 最大重试次数（默认3次）
 * @returns 是否发送成功
 */
async function sendEmailWithRetry(
  email: string,
  downloadUrl: string,
  calculationId: string,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Background] Sending email (attempt ${attempt}/${maxRetries})...`);
      await sendPdfDownloadEmail({
        to: email,
        downloadUrl,
        calculationId,
        expiresIn: '24 hours',
      });
      console.log(`[Background] Email sent successfully on attempt ${attempt}`);
      return true;
    } catch (error) {
      console.error(`[Background] Email send failed (attempt ${attempt}/${maxRetries}):`, error);

      if (attempt < maxRetries) {
        // 指数退避：2秒、4秒、8秒
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`[Background] Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  console.error(`[Background] Email send failed after ${maxRetries} attempts`);
  return false;
}

/**
 * 后台任务：上传R2 + 发送邮件 + 清理本地文件
 * @param calculationId - 计算ID
 * @param email - 用户邮箱
 * @param pdfBuffer - PDF buffer
 */
export async function processBackgroundTasks(
  calculationId: string,
  email: string,
  pdfBuffer: Buffer
): Promise<void> {
  console.log(`[Background] Starting background tasks for calculation: ${calculationId}`);

  const r2Key = `heloc-reports/heloc-report-${calculationId}.pdf`;

  try {
    // 步骤1：上传到R2（带重试）
    const uploadSuccess = await uploadToR2WithRetry(pdfBuffer, r2Key);

    if (uploadSuccess) {
      // 步骤2：生成签名URL
      const signedUrl = await getSignedDownloadUrl(r2Key, 86400);

      // 步骤3：更新数据库（标记R2上传成功）
      await prisma.pdfPurchase.updateMany({
        where: {
          calculationId,
          email,
        },
        data: {
          r2Key,
          pdfUrl: signedUrl,
        },
      });
      console.log(`[Background] Database updated with R2 URL`);

      // 步骤4：发送邮件（带重试）
      await sendEmailWithRetry(email, signedUrl, calculationId);

      // 步骤5：删除本地文件
      const deleted = deleteLocalPdf(calculationId);
      if (deleted) {
        console.log(`[Background] Local PDF deleted after successful R2 upload`);
      }
    } else {
      console.error(`[Background] R2 upload failed, keeping local file as backup`);
    }

    console.log(`[Background] Background tasks completed for calculation: ${calculationId}`);
  } catch (error) {
    console.error(`[Background] Background tasks failed:`, error);
    // 保留本地文件作为备份
  }
}

/**
 * 触发后台任务（不等待完成）
 * 使用 setTimeout 确保任务在后台异步执行
 */
export async function triggerBackgroundTasks(
  calculationId: string,
  email: string,
  pdfBuffer: Buffer
): Promise<void> {
  console.log(`[Background] Background tasks triggered for calculation: ${calculationId}`);

  try {
    await processBackgroundTasks(calculationId, email, pdfBuffer);
  } catch (error) {
    console.error(`[Background] Unhandled error in background tasks:`, error);
  }
}
