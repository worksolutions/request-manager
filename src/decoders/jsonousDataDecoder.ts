import Decoder from 'jsonous';

import type { DataDecoder } from '../interfaces/dataDecoder';

import { DecoderError } from '../errors/decoderError';

import { getErrorMessage } from '../lib';

export class JsonousDataDecoder<T> implements DataDecoder<T> {
  constructor(private readonly _decoder: Decoder<T>) {}

  public async decode(raw: unknown): Promise<T> {
    const [data, error] = this._decoder.decodeAny(raw).cata<[T, null] | [null, string]>({
      Ok: (val) => [val, null],
      Err: (err) => [null, err],
    });

    if (data) return Promise.resolve(data);

    throw new DecoderError(getErrorMessage(error));
  }
}
