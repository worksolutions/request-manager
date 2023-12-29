import type { RequestConfig } from '../interfaces/requestConfig.ts';
import type { RequestEngineResponse } from '../interfaces/requestEngine.ts';

export class RequestEngineError extends Error {
  constructor(
    message?: string,
    public readonly code?: string,
    public readonly config?: RequestConfig,
    public readonly request?: any,
    public readonly response?: RequestEngineResponse
  ) {
    super(message);
  }

  public get status(): number | undefined {
    return this.response?.status;
  }
}
