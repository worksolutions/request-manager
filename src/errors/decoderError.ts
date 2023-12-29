export class DecoderError extends Error {
  public readonly name = 'DecoderError';

  constructor(message?: string) {
    super(`Response parsing error: ${message}`);
  }
}
