/**
 * PDF Security Type Definitions
 * PDF安全访问相关的类型定义
 */

// ============================================
// Access Token Types
// ============================================

export interface TokenPayload {
  /** PDF Purchase ID */
  purchaseId: string;

  /** User email */
  email: string;

  /** Calculation ID */
  calculationId: string;

  /** Token issued at (timestamp) */
  iat: number;

  /** Token expires at (timestamp) */
  exp: number;
}

export interface AccessToken {
  /** JWT token string */
  token: string;

  /** Expiration date */
  expiresAt: Date;
}

export interface TokenVerificationResult {
  /** Whether token is valid */
  valid: boolean;

  /** Decoded payload if valid */
  payload?: TokenPayload;

  /** Error message if invalid */
  error?: string;
}
