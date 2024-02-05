import { AxiosRequestEngine } from '../../src/requestEngines/axiosRequestEngine';

describe('AxiosRequestEngine', function () {
  const axiosRequestEngine = new AxiosRequestEngine();

  axiosRequestEngine.baseURL = 'api/';

  it('should resolve with status 200', function () {
    axiosRequestEngine.makeRequest({ url: '200' }).then((response) => {
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
    });
  });

  it('should resolve with status 404', function () {
    axiosRequestEngine.makeRequest({ url: '404' }).then((response) => {
      expect(response.status).toBe(404);
      expect(response.statusText).toBe('Not Found');
    });
  });

  // todo add another test-cases
});
