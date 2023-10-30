import axios, { AxiosError, AxiosRequestConfig, ResponseType } from "axios";
import Decoder from "jsonous";
import qs from "qs";
import { Service } from "typedi";

const ok = (value: any) => value;

export const identityValueDecoder: Decoder<any> = new Decoder(ok);

export enum METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

function template(text: string, keyMap: Record<string, string | number>) {
  return Object.keys(keyMap).reduce(
    (prev, mapKey) => prev.replace(`{${mapKey}}`, keyMap[mapKey].toString()),
    text
  );
}

function stringify(object: any): string {
  return qs.stringify(object);
}

class MyError extends Error {
  axiosError?: AxiosError | null;
  constructor(message: string, axiosError?: AxiosError) {
    super(message);
    this.axiosError = axiosError || null;
  }
}

@Service({ global: true })
export class RequestManager {
  static baseURL = "";

  static beforeRequestMiddleware: ((data: {
    config: AxiosRequestConfig;
  }) => void | Promise<void>)[] = [];

  static afterRequestMiddleware: ((data: any) => void | Promise<void>)[] = [];

  static beforeErrorMiddleware: {
    key: string;
    middleware: (data: {
      error: MyError;
      config: AxiosRequestConfig;
      shareData: Record<string, any>;
    }) => MyError | Promise<MyError | null> | null;
  }[] = [];

  private static async applyAllBeforeRequestMiddleware(
    config: AxiosRequestConfig
  ) {
    for (let i = 0; i < RequestManager.beforeRequestMiddleware.length; i++) {
      const middleware = RequestManager.beforeRequestMiddleware[i];
      await middleware({ config });
    }
  }

  private static async applyAllAfterRequestMiddleware(data: any) {
    for (let i = 0; i < RequestManager.afterRequestMiddleware.length; i++) {
      const middleware = RequestManager.afterRequestMiddleware[i];
      await middleware(data);
    }
  }

  private static async applyAllBeforeErrorMiddleware(
    error: MyError,
    config: AxiosRequestConfig,
    blackList: string[]
  ) {
    const shareData: Record<string, any> = {};
    for (let i = 0; i < RequestManager.beforeErrorMiddleware.length; i++) {
      const { key, middleware } = RequestManager.beforeErrorMiddleware[i];
      if (blackList.includes(key)) continue;
      const middlewareResult = await middleware({ error, config, shareData });
      if (!middlewareResult) break;

      error = middlewareResult;
    }

    return { error: error.message, config, axiosError: error.axiosError };
  }

  private static async makeRequest({
    url,
    method,
    requestConfig,
    requestData: { options = {}, urlParams, additionalQueryParams, body },
  }: Required<Pick<CreateRequest<any>, "url" | "method" | "requestConfig">> & {
    requestData: RequestData;
  }) {
    const requestData: AxiosRequestConfig = {
      url,
      method,
      baseURL: RequestManager.baseURL,
      headers: { accept: "application/json" },
      paramsSerializer: stringify,
    };

    if (requestConfig.contentType) {
      requestData.headers!["content-type"] = requestConfig.contentType;
    }

    if (requestConfig.responseType) {
      requestData.responseType = requestConfig.responseType;
    }

    requestData[method === METHODS.GET ? "params" : "data"] = body;

    if (urlParams) {
      requestData.url = template(requestData.url!, urlParams);
    }

    if (additionalQueryParams) {
      requestData.params = additionalQueryParams;
    }

    requestData.onUploadProgress = ({ loaded, total }) => {
      if (options.progressReceiver) {
        options.progressReceiver(loaded / Number(total));
      }
    };

    try {
      await RequestManager.applyAllBeforeRequestMiddleware(requestData);
      const { data } = await axios(requestData);
      if (method !== METHODS.GET && !options?.disableAfterRequestMiddlewares) {
        await RequestManager.applyAllAfterRequestMiddleware(data);
      }
      return [{ requestData, response: data }, null] as const;
    } catch (axiosError) {
      return [
        null,
        { requestData, axiosError } as {
          requestData: AxiosRequestConfig;
          axiosError: AxiosError;
        },
      ] as const;
    }
  }

  private static async applyError(
    error: MyError,
    axiosRequestConfig: AxiosRequestConfig,
    requestData: RequestData = {}
  ) {
    const disableBeforeErrorMiddlewares =
      requestData.options?.disableBeforeErrorMiddlewares || [];
    if (disableBeforeErrorMiddlewares?.includes("all")) return error;
    console.log(error);
    return await RequestManager.applyAllBeforeErrorMiddleware(
      error,
      axiosRequestConfig,
      disableBeforeErrorMiddlewares
    );
  }

  createRequest<DecoderValue>({
    url,
    method = METHODS.GET,
    requestConfig = {},
    serverDataDecoder = identityValueDecoder,
  }: CreateRequest<DecoderValue>) {
    return async function (
      requestData: RequestData = {}
    ): Promise<DecoderValue> {
      const [requestResult, requestError] = await RequestManager.makeRequest({
        url,
        method,
        requestConfig,
        requestData,
      });
      if (requestError) {
        throw await RequestManager.applyError(
          new MyError(requestError.axiosError.message, requestError.axiosError),
          requestError.requestData,
          requestData
        );
      }
      if (!requestResult || !serverDataDecoder) return null!;
      const data = requestResult.response;
      if (data) return data;
      throw await RequestManager.applyError(
        new MyError(`${url} parsing error: have no data`),
        requestResult.requestData,
        requestData
      );
    };
  }
}

RequestManager.beforeErrorMiddleware.push({
  key: "initial",
  middleware: ({ error }) => error,
});

type CreateRequest<DecoderGenericType> = {
  url: string;
  method?: METHODS;
  serverDataDecoder?: Decoder<DecoderGenericType>;
  requestConfig?: {
    contentType?: string;
    responseType?: ResponseType;
  };
};

export interface RequestOptions {
  disableAfterRequestMiddlewares?: boolean;
  disableBeforeErrorMiddlewares?: string[];
  progressReceiver?: (progress: number) => void;
}

interface RequestData {
  body?: any;
  additionalQueryParams?: Record<string, any>;
  options?: RequestOptions;
  urlParams?: Record<string, string | number>;
}
