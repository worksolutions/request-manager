type MaxUploadRate = number;

type MaxDownloadRate = number;

type Milliseconds = number;

interface Credentials {
  username: string;
  password: string;
}

interface ProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: any;
}

export enum Method {
  GET = 'get',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  PURGE = 'purge',
  LINK = 'link',
  UNLINK = 'unlink',
}

export enum ResponseType {
  ARRAYBUFFER = 'arraybuffer',
  BLOB = 'blob',
  DOCUMENT = 'document',
  JSON = 'json',
  TEXT = 'text',
  STREAM = 'stream',
}

export enum ResponseEncoding {
  ASCII = 'ascii',
  ANSI = 'ansi',
  BINARY = 'binary',
  BASE64 = 'base64',
  BASE64URL = 'base64url',
  HEX = 'hex',
  LATIN1 = 'latin1',
  'UCS-2' = 'ucs-2',
  UCS2 = 'ucs2',
  'UTF-8' = 'utf-8',
  UTF8 = 'utf8',
  UTF16LE = 'utf16le',
}

export enum ContentType {
  'TEXT/HTML' = 'text/html',
  'TEXT/PLAIN' = 'text/plain',
  'MULTIPART/FORM-DATA' = 'multipart/form-data',
  'APPLICATION/JSON' = 'application/json',
  'APPLICATION/X-WWW-FORM-URLENCODED' = 'application/x-www-form-urlencoded',
  'APPLICATION/OCTET-STREAM' = 'application/octet-stream',
}

export interface RequestConfig {
  url?: string;
  method?: Method;
  // baseURL?: string;
  // transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
  // transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
  headers?: Record<string, string>;
  params?: Record<string | number | symbol, any> | URLSearchParams;
  // paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer; // todo return
  data?: any;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  // adapter?: AxiosAdapterConfig | AxiosAdapterConfig[];
  auth?: Credentials;
  responseType?: ResponseType;
  contentType?: ContentType;
  responseEncoding?: ResponseEncoding;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: ProgressEvent) => void; // todo simplify
  onDownloadProgress?: (progressEvent: ProgressEvent) => void; // todo simplify
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxRate?: number | [MaxUploadRate, MaxDownloadRate];
  beforeRedirect?: (options: Record<string, any>, responseDetails: { headers: Record<string, string> }) => void;
  // socketPath?: string | null;
  // transport?: any;
  httpAgent?: any;
  httpsAgent?: any;
  // proxy?: AxiosProxyConfig | false;
  // cancelToken?: CancelToken;
  decompress?: boolean;
  // transitional?: TransitionalOptions;
  // signal?: GenericAbortSignal;
  // insecureHTTPParser?: boolean;
  // env?: {
  //     FormData?: new (...args: any[]) => object;
  // };
  // formSerializer?: FormSerializerOptions;
  // family?: 4 | 6 | undefined;
  // lookup?: ((hostname: string, options: object, cb: (err: Error | null, address: string, family: number) => void) => void) |
  //     ((hostname: string, options: object) => Promise<[address: string, family: number] | string>);
}
