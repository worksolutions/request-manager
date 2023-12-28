export interface DataDecoder<T> {
  decode: (data: unknown) => Promise<T>;
}
