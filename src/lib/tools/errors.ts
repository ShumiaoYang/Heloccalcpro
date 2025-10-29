export type SummarizerErrorCode = 'validation' | 'config' | 'provider' | 'timeout' | 'unknown';

export class SummarizerError extends Error {
  code: SummarizerErrorCode;
  details?: string;

  constructor(message: string, code: SummarizerErrorCode, details?: string) {
    super(message);
    this.name = 'SummarizerError';
    this.code = code;
    this.details = details;
  }
}

export function isSummarizerError(error: unknown): error is SummarizerError {
  return error instanceof SummarizerError;
}
