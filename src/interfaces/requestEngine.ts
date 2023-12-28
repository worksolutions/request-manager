import { RequestConfig } from './requestConfig';

export interface RequestEngineResponse {
  status: number;
  statusText: string;
  data: unknown | null;
  config: RequestConfig;
  headers: Record<string, any>;
  request?: any;
}

export interface RequestEngine {
  set baseURL(url: string);

  makeRequest: (requestConfig: RequestConfig) => Promise<RequestEngineResponse>;
}
