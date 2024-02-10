import { RequestConfig } from '../interfaces/requestConfig';

export abstract class RequestMiddleware {
  public abstract use(request: RequestConfig, next: () => void): void;
}
