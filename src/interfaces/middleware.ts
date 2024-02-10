import { RequestMiddleware } from '../middlewares/requestMiddleware';
import { ResponseMiddleware } from '../middlewares/responseMiddleware';
import { ErrorMiddleware } from '../middlewares/errorMiddleware';

import { Method } from './requestConfig';

export interface MiddlewareRouteConfig {
  path: string;
  methods?: Method[];
}

export interface MiddlewareConfig<M extends RequestMiddleware | ResponseMiddleware | ErrorMiddleware> {
  apply: MiddlewareRouteConfig;
  exclude?: MiddlewareRouteConfig;
  middleware: M;
}
