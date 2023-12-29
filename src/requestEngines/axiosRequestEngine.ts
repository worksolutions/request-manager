import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import type { RequestEngine, RequestEngineResponse } from '../interfaces/requestEngine.ts';
import type { RequestConfig } from '../interfaces/requestConfig.ts';

import { RequestEngineError } from '../errors/requestEngineError.ts';
import { getErrorMessage } from '../lib.ts';

export class AxiosRequestEngine implements RequestEngine {
  constructor(private _baseURL: string = '') {}

  set baseURL(url: string) {
    this._baseURL = url;
  }

  public async makeRequest(requestConfig: RequestConfig): Promise<RequestEngineResponse> {
    let response: RequestEngineResponse | undefined = undefined;

    try {
      const {
        data = null,
        request,
        headers,
        status,
        statusText,
      }: AxiosResponse<unknown, unknown> = await axios(this._convertRequestConfigToAxiosRequestConfig(requestConfig));

      response = { data, config: requestConfig, status, statusText, headers, request };
      return response;
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        const { message, code, request } = error as AxiosError;
        throw new RequestEngineError(message, code, requestConfig, request, response);
      } else {
        throw new RequestEngineError(getErrorMessage(error));
      }
    }
  }

  private _convertRequestConfigToAxiosRequestConfig(requestConfig: RequestConfig): AxiosRequestConfig {
    return {
      url: requestConfig.url,
      baseURL: this._baseURL,
      method: requestConfig.method,
      headers: { ...(requestConfig.headers || {}), 'Content-Type': requestConfig.contentType },
      params: requestConfig.params,
      data: requestConfig.data,
      timeout: requestConfig.timeout,
      timeoutErrorMessage: requestConfig.timeoutErrorMessage,
      withCredentials: requestConfig.withCredentials,
      auth: requestConfig.auth,
      responseType: requestConfig.responseType,
      responseEncoding: requestConfig.responseEncoding,
      xsrfCookieName: requestConfig.xsrfCookieName,
      xsrfHeaderName: requestConfig.xsrfHeaderName,
      onUploadProgress: requestConfig.onUploadProgress,
      onDownloadProgress: requestConfig.onDownloadProgress,
      maxContentLength: requestConfig.maxContentLength,
      validateStatus: requestConfig.validateStatus,
      maxBodyLength: requestConfig.maxBodyLength,
      maxRedirects: requestConfig.maxRedirects,
      maxRate: requestConfig.maxRate,
      beforeRedirect: requestConfig.beforeRedirect,
      httpAgent: requestConfig.httpAgent,
      httpsAgent: requestConfig.httpsAgent,
      decompress: requestConfig.decompress,
    };
  }
}
