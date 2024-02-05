import { RequestEngineError } from '../../src/errors/requestEngineError';
import { RequestConfig } from '../../src/interfaces/requestConfig';
import { RequestEngineResponse } from '../../src/interfaces/requestEngine';

describe('RequestEngineError', function () {
  it('should create an RequestEngineError with message, config, code, request, response, stack and isAxiosError', function () {
    const request = { path: '/foo' };
    const config: RequestConfig = { url: 'bar', data: { foo: 'baz' } };
    const response: RequestEngineResponse = {
      status: 200,
      statusText: 'OK',
      data: { foo: 'bar' },
      config,
      request,
      headers: { 'Content-Type': 'application/json' },
    };
    const error = new RequestEngineError('Boom!', 'ESOMETHING', config, request, response);
    expect(error instanceof Error).toBe(true);
    expect(error.message).toBe('Boom!');
    expect(error.code).toBe('ESOMETHING');
    expect(error.config).toEqual(config);
    expect(error.request).toEqual(request);
    expect(error.response).toEqual(response);
    expect(error.stack).toBeDefined();
  });
});
