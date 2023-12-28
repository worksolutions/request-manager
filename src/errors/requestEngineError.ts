import type { RequestConfig } from '../interfaces/requestConfig.ts';
import type { RequestEngineResponse } from '../interfaces/requestEngine.ts';

export class RequestEngineError extends Error {
  constructor(
    message?: string,
    public readonly config?: RequestConfig,
    public readonly code?: string,
    public readonly request?: any,
    public readonly response?: RequestEngineResponse,
    public readonly status?: number
  ) {
    super(message);
  }
}
