import { RequestEngineError } from '../errors/requestEngineError';

import { Method, RequestConfig } from '../interfaces/requestConfig';
import { RequestEngineResponse } from '../interfaces/requestEngine';
import { MiddlewareConfig, MiddlewareRouteConfig } from '../interfaces/middleware';

import { RequestMiddleware } from '../middlewares/requestMiddleware';
import { ResponseMiddleware } from '../middlewares/responseMiddleware';
import { ErrorMiddleware } from '../middlewares/errorMiddleware';

interface MiddlewaresConfigs {
  request: MiddlewareConfig<RequestMiddleware>[];
  response: MiddlewareConfig<ResponseMiddleware>[];
  error: MiddlewareConfig<ErrorMiddleware>[];
}

export abstract class RequestEngine {
  private readonly _middlewaresConfigs: MiddlewaresConfigs = {
    request: [],
    response: [],
    error: [],
  };

  protected abstract _makeRequest(requestConfig: RequestConfig): Promise<RequestEngineResponse>;

  public constructor(protected _baseURL: string = '') {}

  public set baseURL(url: string) {
    this._baseURL = url;
  }

  public applyRequestMiddleware(...configs: MiddlewareConfig<RequestMiddleware>[]): void {
    this._middlewaresConfigs.request.push(...configs);
  }

  public applyResponseMiddleware(...configs: MiddlewareConfig<ResponseMiddleware>[]): void {
    this._middlewaresConfigs.response.push(...configs);
  }

  public applyErrorMiddleware(...configs: MiddlewareConfig<ErrorMiddleware>[]): void {
    this._middlewaresConfigs.error.push(...configs);
  }

  public async makeRequest(requestConfig: RequestConfig): Promise<RequestEngineResponse> {
    try {
      this._applyRequestMiddlewares(requestConfig, this._middlewaresConfigs.request, requestConfig);

      const response = await this._makeRequest(requestConfig);

      this._applyResponseMiddlewares(requestConfig, this._middlewaresConfigs.response, response);

      return response;
    } catch (error) {
      if (RequestEngineError.isRequestEngineError(error)) {
        this._applyErrorMiddlewares(requestConfig, this._middlewaresConfigs.error, error);
      }

      throw error;
    }
  }

  // TODO to solve DRY
  private _applyRequestMiddlewares(
    config: RequestConfig,
    middlewaresConfig: MiddlewareConfig<RequestMiddleware>[],
    request: RequestConfig
  ): void {
    if (middlewaresConfig.length === 0) return;

    const nextMiddlewaresConfig = middlewaresConfig.slice(1);
    const { apply, exclude, middleware } = middlewaresConfig[0];

    if (!this._isMiddlewareAllowed(config, apply, exclude)) {
      return this._applyRequestMiddlewares(config, nextMiddlewaresConfig, request);
    }

    middleware.use(request, () => this._applyRequestMiddlewares(config, nextMiddlewaresConfig, request));
  }

  private _applyResponseMiddlewares(
    config: RequestConfig,
    middlewaresConfig: MiddlewareConfig<ResponseMiddleware>[],
    response: RequestEngineResponse
  ): void {
    if (middlewaresConfig.length === 0) return;

    const nextMiddlewaresConfig = middlewaresConfig.slice(1);
    const { apply, exclude, middleware } = middlewaresConfig[0];

    if (!this._isMiddlewareAllowed(config, apply, exclude)) {
      return this._applyResponseMiddlewares(config, nextMiddlewaresConfig, response);
    }

    middleware.use(config, response, () => this._applyResponseMiddlewares(config, nextMiddlewaresConfig, response));
  }

  private _applyErrorMiddlewares(
    config: RequestConfig,
    middlewaresConfig: MiddlewareConfig<ErrorMiddleware>[],
    error: RequestEngineError
  ): void {
    if (middlewaresConfig.length === 0) return;

    const nextMiddlewaresConfig = middlewaresConfig.slice(1);
    const { apply, exclude, middleware } = middlewaresConfig[0];

    if (!this._isMiddlewareAllowed(config, apply, exclude)) {
      return this._applyErrorMiddlewares(config, nextMiddlewaresConfig, error);
    }

    middleware.use(error, () => this._applyErrorMiddlewares(config, nextMiddlewaresConfig, error));
  }

  private _isMiddlewareAllowed(
    config: RequestConfig,
    applyRoute: MiddlewareRouteConfig,
    excludeRoute?: MiddlewareRouteConfig
  ): boolean {
    const requestMethod = config.method ?? Method.GET;

    if (excludeRoute) {
      const isExcludePath = excludeRoute.path && config.url?.startsWith(excludeRoute.path);
      const isExcludeMethod = !excludeRoute.methods || excludeRoute.methods?.includes(requestMethod);

      if (isExcludePath && isExcludeMethod) return false;
    }

    const isNotAllowedPath = !config.url?.startsWith(applyRoute.path);
    const isNotAllowedMethod = applyRoute.methods && !applyRoute.methods?.includes(requestMethod);

    return !(isNotAllowedPath || isNotAllowedMethod);
  }
}
