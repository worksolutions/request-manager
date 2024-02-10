import { RequestEngineError } from '../errors/requestEngineError';

export abstract class ErrorMiddleware {
  public abstract use(error: RequestEngineError, next: () => void): void;
}
