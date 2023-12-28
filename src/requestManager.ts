import type { RequestConfig } from './interfaces/requestConfig';
import type { RequestEngine } from './interfaces/requestEngine';
import type { DataDecoder } from './interfaces/dataDecoder';

import { AxiosRequestEngine } from './requestEngines/axiosRequestEngine';

interface RequestManagerConstructor {
  baseURL?: string;
  requestEngine?: RequestEngine;
}

export class RequestManager {
  private readonly requestEngine: RequestEngine = new AxiosRequestEngine();

  constructor(config: RequestManagerConstructor) {
    config.requestEngine && (this.requestEngine = config.requestEngine);
    config.baseURL && (this.requestEngine.baseURL = config.baseURL);
  }

  public async createRequest<ResponseType>(requestConfig: RequestConfig, serverDataDecoder?: DataDecoder<ResponseType>): Promise<ResponseType> {
    const requestEngineResponse = await this.requestEngine.makeRequest(requestConfig);

    if (!serverDataDecoder) return requestEngineResponse.data as ResponseType;

    return serverDataDecoder.decode(requestEngineResponse.data);
  }
}
