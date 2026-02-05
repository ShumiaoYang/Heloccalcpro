import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Check if R2 is configured
const isR2Configured = !!(
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME
);

// Initialize R2 client (S3-compatible)
const r2Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const bucketName = process.env.R2_BUCKET_NAME || '';

/**
 * Upload PDF buffer to Cloudflare R2
 * @param buffer - PDF file buffer
 * @param key - Object key (file path in R2)
 * @returns R2 object key
 */
export async function uploadPdfToR2(buffer: Buffer, key: string): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 is not configured. Please set R2 environment variables.');
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
      ContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
    });

    await r2Client.send(command);
    console.log(`[R2] Successfully uploaded: ${key}`);
    return key;
  } catch (error) {
    console.error('[R2] Upload failed:', error);
    throw new Error(`Failed to upload PDF to R2: ${error}`);
  }
}

/**
 * Generate signed download URL for R2 object
 * @param key - R2 object key
 * @param expiresIn - URL expiration time in seconds (default: 24 hours)
 * @returns Signed download URL
 */
export async function getSignedDownloadUrl(key: string, expiresIn: number = 86400): Promise<string> {
  if (!r2Client) {
    throw new Error('R2 is not configured. Please set R2 environment variables.');
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    console.log(`[R2] Generated signed URL for: ${key} (expires in ${expiresIn}s)`);
    return signedUrl;
  } catch (error) {
    console.error('[R2] Failed to generate signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error}`);
  }
}

/**
 * Delete PDF from R2
 * @param key - R2 object key
 */
export async function deletePdfFromR2(key: string): Promise<void> {
  if (!r2Client) {
    throw new Error('R2 is not configured. Please set R2 environment variables.');
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`[R2] Successfully deleted: ${key}`);
  } catch (error) {
    console.error('[R2] Delete failed:', error);
    throw new Error(`Failed to delete PDF from R2: ${error}`);
  }
}

/**
 * Get public URL for R2 object (if custom domain is configured)
 * @param key - R2 object key
 * @returns Public URL or null if not configured
 */
export function getPublicUrl(key: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    return null;
  }
  return `${publicUrl}/${key}`;
}

/**
 * Check if R2 is properly configured
 */
export function isR2Available(): boolean {
  return isR2Configured;
}
