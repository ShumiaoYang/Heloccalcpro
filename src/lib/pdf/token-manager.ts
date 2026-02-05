/**
 * PDF Access Token Manager
 * 管理PDF下载的安全令牌
 */

import * as jwt from 'jsonwebtoken';
import type {
  TokenPayload,
  AccessToken,
  TokenVerificationResult,
} from '../../types/pdf-security';

// JWT密钥（从环境变量获取）
const JWT_SECRET = process.env.PDF_ACCESS_TOKEN_SECRET || 'default-secret-change-in-production';

// 令牌有效期（小时）
const TOKEN_EXPIRY_HOURS = parseInt(process.env.PDF_TOKEN_EXPIRY_HOURS || '24', 10);

/**
 * 生成PDF访问令牌
 * @param purchaseId - PDF购买记录ID
 * @param email - 用户邮箱
 * @param calculationId - 计算记录ID
 * @returns AccessToken对象
 */
export function generateAccessToken(
  purchaseId: string,
  email: string,
  calculationId: string
): AccessToken {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = new Date((now + TOKEN_EXPIRY_HOURS * 3600) * 1000);

  const payload: TokenPayload = {
    purchaseId,
    email,
    calculationId,
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 3600,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return {
    token,
    expiresAt,
  };
}

/**
 * 验证PDF访问令牌
 * @param token - JWT令牌字符串
 * @returns TokenVerificationResult对象
 */
export function verifyAccessToken(token: string): TokenVerificationResult {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 检查令牌是否过期
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return {
        valid: false,
        error: 'Token has expired',
      };
    }

    return {
      valid: true,
      payload: decoded,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

