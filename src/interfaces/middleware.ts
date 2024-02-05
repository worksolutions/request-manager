import { RequestEngineError } from '../errors/requestEngineError';

import { Method, RequestConfig } from './requestConfig';
import { RequestEngineResponse } from './requestEngine';

interface MiddlewareRouteConfig {
  path: string;
  methods?: Method[];
}

type Middleware<T extends RequestConfig | RequestEngineResponse | RequestEngineError> = (
  payload: T,
  breakFn: () => void
) => void | Promise<void>;

interface MiddlewareConfig<M> {
  apply: MiddlewareRouteConfig;
  exclude?: MiddlewareRouteConfig;
  middleware: M;
}

export type RequestMiddleware = Middleware<RequestConfig>;
export type RequestMiddlewareConfig = MiddlewareConfig<RequestMiddleware>;

export type ResponseMiddleware = Middleware<RequestEngineResponse>;
export type ResponseMiddlewareConfig = MiddlewareConfig<ResponseMiddleware>;

export type ErrorMiddleware = Middleware<RequestEngineError>;
export type ErrorMiddlewareConfig = MiddlewareConfig<ErrorMiddleware>;
