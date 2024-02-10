/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/naming-convention */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { RequestEngineError } from '../errors/requestEngineError';

import type { RequestEngineResponse } from '../interfaces/requestEngine';
import type { RequestConfig } from '../interfaces/requestConfig';

import { getErrorMessage } from '../lib';

import { RequestEngine } from './requestEngine';

export class AxiosRequestEngine extends RequestEngine {
  public async _makeRequest(requestConfig: RequestConfig): Promise<RequestEngineResponse> {
    let response: RequestEngineResponse | undefined = undefined;

    try {
      const {
        data = null,
        request,
        headers,
        status,
        statusText,
      }: AxiosResponse<unknown, unknown> = await axios<unknown>(
        this._convertRequestConfigToAxiosRequestConfig(requestConfig)
      );

      response = { data, config: requestConfig, status, statusText, headers, request };
      return response;
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        const { message, code, request, response: errorBody } = error as AxiosError;
        console.error(`Backend returned code ${code}, body was: `, errorBody);
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
      headers: { ...(requestConfig.headers ?? {}), 'Content-Type': requestConfig.contentType },
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
