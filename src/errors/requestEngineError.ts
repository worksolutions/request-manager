import type { RequestConfig } from '../interfaces/requestConfig';
import type { RequestEngineResponse } from '../interfaces/requestEngine';

export class RequestEngineError extends Error {
  public readonly name: 'RequestEngineError' = 'RequestEngineError' as const;

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    message?: string,
    public readonly code?: string,
    public readonly config?: RequestConfig,
    public readonly request?: any,
    public readonly response?: RequestEngineResponse
  ) {
    super(message);

    Object.setPrototypeOf(this, RequestEngineError.prototype);
  }

  public get status(): number | undefined {
    return this.response?.status;
  }

  public static isRequestEngineError(e: unknown): e is RequestEngineError {
    return e instanceof RequestEngineError;
  }
}
