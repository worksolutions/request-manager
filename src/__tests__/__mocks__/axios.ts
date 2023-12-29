import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';

export default async function axios(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      const responseConfig = { ...config, headers: new AxiosHeaders() };

      switch (config.url) {
        case '200': {
          resolve({
            data: [],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: responseConfig,
            request: undefined,
          });
          return;
        }
        case '404': {
          resolve({
            data: null,
            status: 404,
            statusText: 'Not Found',
            headers: {},
            config: responseConfig,
            request: undefined,
          });
          return;
        }
        case 'reject': {
          reject();
          return;
        }
        default:
          reject();
      }
    });
  });
}
