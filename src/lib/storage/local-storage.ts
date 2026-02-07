/**
 * Local PDF Storage Utilities
 * 本地PDF存储工具
 *
 * 用于在服务器本地临时存储PDF文件，提供快速下载
 * PDF上传到R2后会自动删除本地文件
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// 本地PDF存储目录 - 使用 /tmp 目录以兼容 Vercel 无服务器环境
const LOCAL_PDF_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'pdfs')
  : path.join(process.cwd(), 'private', 'pdfs');

/**
 * 确保本地PDF目录存在
 */
function ensureLocalPdfDir(): void {
  if (!fs.existsSync(LOCAL_PDF_DIR)) {
    fs.mkdirSync(LOCAL_PDF_DIR, { recursive: true });
    console.log('[Local Storage] Created directory:', LOCAL_PDF_DIR);
  }
}

/**
 * 获取本地PDF文件路径
 * @param calculationId - 计算ID
 * @returns 本地文件完整路径
 */
export function getLocalPdfPath(calculationId: string): string {
  return path.join(LOCAL_PDF_DIR, `heloc-report-${calculationId}.pdf`);
}

/**
 * 获取本地PDF文件名
 * @param calculationId - 计算ID
 * @returns 文件名
 */
export function getLocalPdfFilename(calculationId: string): string {
  return `heloc-report-${calculationId}.pdf`;
}

/**
 * 保存PDF到本地存储
 * @param buffer - PDF文件buffer
 * @param calculationId - 计算ID
 * @returns 本地文件路径
 */
export async function saveLocalPdf(buffer: Buffer, calculationId: string): Promise<string> {
  try {
    ensureLocalPdfDir();

    const filePath = getLocalPdfPath(calculationId);

    // 写入文件
    fs.writeFileSync(filePath, buffer);

    console.log(`[Local Storage] Saved PDF: ${filePath} (${buffer.length} bytes)`);

    return filePath;
  } catch (error) {
    console.error('[Local Storage] Failed to save PDF:', error);
    throw new Error(`Failed to save local PDF: ${error}`);
  }
}

/**
 * 检查本地PDF文件是否存在
 * @param calculationId - 计算ID
 * @returns 文件是否存在
 */
export function localPdfExists(calculationId: string): boolean {
  const filePath = getLocalPdfPath(calculationId);
  return fs.existsSync(filePath);
}

/**
 * 读取本地PDF文件
 * @param calculationId - 计算ID
 * @returns PDF文件buffer
 */
export function readLocalPdf(calculationId: string): Buffer {
  const filePath = getLocalPdfPath(calculationId);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Local PDF not found: ${filePath}`);
  }

  return fs.readFileSync(filePath);
}

/**
 * 删除本地PDF文件
 * @param calculationId - 计算ID
 * @returns 是否删除成功
 */
export function deleteLocalPdf(calculationId: string): boolean {
  try {
    const filePath = getLocalPdfPath(calculationId);

    if (!fs.existsSync(filePath)) {
      console.log(`[Local Storage] File not found, skip deletion: ${filePath}`);
      return false;
    }

    fs.unlinkSync(filePath);
    console.log(`[Local Storage] Deleted PDF: ${filePath}`);

    return true;
  } catch (error) {
    console.error('[Local Storage] Failed to delete PDF:', error);
    return false;
  }
}

/**
 * 获取本地PDF文件信息
 * @param calculationId - 计算ID
 * @returns 文件信息（大小、创建时间等）
 */
export function getLocalPdfInfo(calculationId: string): {
  exists: boolean;
  size?: number;
  createdAt?: Date;
  path?: string;
} {
  const filePath = getLocalPdfPath(calculationId);

  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }

  const stats = fs.statSync(filePath);

  return {
    exists: true,
    size: stats.size,
    createdAt: stats.birthtime,
    path: filePath,
  };
}

/**
 * 清理所有本地PDF文件（用于维护）
 * @param olderThanHours - 清理超过指定小时数的文件（默认24小时）
 * @returns 清理的文件数量
 */
export function cleanupOldLocalPdfs(olderThanHours: number = 24): number {
  try {
    ensureLocalPdfDir();

    const files = fs.readdirSync(LOCAL_PDF_DIR);
    const now = Date.now();
    const maxAge = olderThanHours * 60 * 60 * 1000; // 转换为毫秒

    let deletedCount = 0;

    for (const file of files) {
      if (!file.endsWith('.pdf')) continue;

      const filePath = path.join(LOCAL_PDF_DIR, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.birthtimeMs;

      if (age > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`[Local Storage] Cleaned up old PDF: ${file} (age: ${Math.round(age / 3600000)}h)`);
      }
    }

    console.log(`[Local Storage] Cleanup completed: ${deletedCount} files deleted`);
    return deletedCount;
  } catch (error) {
    console.error('[Local Storage] Cleanup failed:', error);
    return 0;
  }
}
