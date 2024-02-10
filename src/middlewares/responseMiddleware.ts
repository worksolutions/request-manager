import { RequestEngineResponse } from '../interfaces/requestEngine';
import { RequestConfig } from '../interfaces/requestConfig';

export abstract class ResponseMiddleware {
  public abstract use(request: RequestConfig, response: RequestEngineResponse, next: () => void): void;
}
