import { RequestConfig } from './requestConfig';

export interface RequestEngineResponse {
  status: number;
  statusText: string;
  data: unknown;
  config: RequestConfig;
  headers: Record<string, any>;
  request?: any;
}

export interface RequestEngine {
  makeRequest: (requestConfig: RequestConfig) => Promise<RequestEngineResponse>;

  set baseURL(url: string);
}
