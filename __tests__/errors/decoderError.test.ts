import { field, string, succeed } from 'jsonous';

import { JsonousDataDecoder } from '../../src/decoders/jsonousDataDecoder';
import { DecoderError } from '../../src/errors/decoderError';
import { getErrorMessage } from '../../src/lib';

describe('DecoderError', function () {
  it('should create an DecoderError with jsonous message', async function () {
    try {
      await new JsonousDataDecoder(
        succeed({})
          .assign('foo', field('foo', string))
          .assign('bar', field('bar', string))
          .assign('baz', field('baz', string))
      ).decode({ bar: 'bar', baz: 'baz' });
    } catch (e) {
      const error = new DecoderError(getErrorMessage(e));
      expect(error instanceof Error).toBe(true);
      expect(error.message).toBe(`Response parsing error: ${getErrorMessage(e)}`);
      expect(error.name).toBe('DecoderError');
      expect(error.stack).toBeDefined();
    }
  });
});
