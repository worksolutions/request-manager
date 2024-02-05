export class DecoderError extends Error {
  public readonly name: 'DecoderError' = 'DecoderError' as const;

  constructor(message?: string) {
    super(`Response parsing error: ${message}`);
  }

  public static isDecoderError(e: unknown): e is DecoderError {
    return e instanceof DecoderError;
  }
}
