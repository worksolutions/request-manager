import { RequestEngineError } from './errors/requestEngineError';
import { DecoderError } from './errors/decoderError';

import type { DataDecoder } from './interfaces/dataDecoder';
import { Method, RequestConfig } from './interfaces/requestConfig';
import { RequestEngine } from './interfaces/requestEngine';
import { ErrorMiddlewareConfig, RequestMiddlewareConfig, ResponseMiddlewareConfig } from './interfaces/middleware';

import { getErrorMessage } from './lib';

export class RequestManager {
  public readonly requestMiddlewares: RequestMiddlewareConfig[] = [];
  public readonly responseMiddlewares: ResponseMiddlewareConfig[] = [];
  public readonly errorMiddlewares: ErrorMiddlewareConfig[] = [];

  constructor(private readonly _requestEngine: RequestEngine) {}

  public async createRequest<ResponseType>(
    requestConfig: RequestConfig,
    responseDataDecoder?: DataDecoder<ResponseType>
  ): Promise<ResponseType> {
    try {
      await this._applyMiddlewares(requestConfig, this.requestMiddlewares, requestConfig);

      const response = await this._requestEngine.makeRequest(requestConfig);

      await this._applyMiddlewares(requestConfig, this.responseMiddlewares, response);

      if (!responseDataDecoder) return response.data as ResponseType;

      return await responseDataDecoder.decode(response.data);
    } catch (error) {
      if (DecoderError.isDecoderError(error)) throw error;

      if (RequestEngineError.isRequestEngineError(error)) {
        await this._applyMiddlewares(requestConfig, this.errorMiddlewares, error);
        throw error;
      }

      throw new Error(getErrorMessage(error));
    }
  }

  private async _applyMiddlewares(
    config: RequestConfig,
    middlewares: RequestMiddlewareConfig[] | ResponseMiddlewareConfig[] | ErrorMiddlewareConfig[],
    payload: any
  ): Promise<void> {
    for (let i = 0; i < middlewares.length; i++) {
      const { apply, exclude, middleware } = middlewares[i];

      const requestMethod = config.method ?? Method.GET;
      const isExcludePath = exclude?.path && config.url?.startsWith(exclude.path);
      const isExcludeMethod = exclude?.methods?.includes(requestMethod);

      if (isExcludePath && isExcludeMethod) continue;

      const isNotAllowedPath = !config.url?.startsWith(apply.path);
      const isNotAllowedMethod = !apply.methods?.includes(requestMethod);

      if (isNotAllowedPath && isNotAllowedMethod) continue;

      await middleware(payload, () => (i = middlewares.length));
    }
  }
}
