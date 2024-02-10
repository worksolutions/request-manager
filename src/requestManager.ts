import type { DataDecoder } from './interfaces/dataDecoder';
import { RequestConfig } from './interfaces/requestConfig';

import { RequestEngine } from './requestEngines/requestEngine';

export class RequestManager {
  constructor(protected readonly _requestEngine: RequestEngine) {}

  public async createRequest<ResponseType>(
    requestConfig: RequestConfig,
    responseDataDecoder?: DataDecoder<ResponseType>
  ): Promise<ResponseType> {
    const response = await this._requestEngine.makeRequest(requestConfig);

    if (!responseDataDecoder) return response.data as ResponseType;

    return await responseDataDecoder.decode(response.data);
  }
}
