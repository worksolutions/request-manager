import { RequestEngineError } from '../errors/requestEngineError';

import { Method, RequestConfig } from './requestConfig';
import { RequestEngineResponse } from './requestEngine';

interface MiddlewareRouteConfig {
  path: string;
  methods?: Method[];
}

export interface MiddlewareConfig<T extends RequestConfig | RequestEngineResponse | RequestEngineError> {
  apply: MiddlewareRouteConfig;
  exclude?: MiddlewareRouteConfig;
  middleware: (payload: T, breakFn: () => void) => void | Promise<void>;
}

export type RequestMiddlewareConfig = MiddlewareConfig<RequestConfig>;

export type ResponseMiddlewareConfig = MiddlewareConfig<RequestEngineResponse>;

export type ErrorMiddlewareConfig = MiddlewareConfig<RequestEngineError>;
