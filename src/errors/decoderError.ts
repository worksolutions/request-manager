export class DecoderError extends Error {
  constructor(message?: string) {
    super(`Response parsing error: ${message}`);
  }
}
