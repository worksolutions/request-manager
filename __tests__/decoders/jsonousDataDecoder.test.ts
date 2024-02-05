import { array, boolean, field, number, string, succeed } from 'jsonous';

import { JsonousDataDecoder } from '../../src/decoders/jsonousDataDecoder';

describe('JsonousDataDecoder', function () {
  const testString = 'foo';
  const testNumber = 10;
  const testBoolean = true;
  const testArray: number[] = [testNumber, testNumber, testNumber];
  const testObject: object = { string: testString, array: testArray, object: { foo: testString } };

  const stringDataDecoder = new JsonousDataDecoder(string);
  const numberDataDecoder = new JsonousDataDecoder(number);
  const booleanDataDecoder = new JsonousDataDecoder(boolean);
  const arrayDataDecoder = new JsonousDataDecoder(array(number));
  const objectDataDecoder = new JsonousDataDecoder(
    succeed({})
      .assign('string', field('string', string))
      .assign('array', field('array', array(number)))
      .assign('object', field('object', succeed({}).assign('foo', field('foo', string))))
  );

  it('successful decoding of primitives', async function () {
    expect(await stringDataDecoder.decode(testString)).toBe(testString);
    expect(await numberDataDecoder.decode(testNumber)).toBe(testNumber);
    expect(await booleanDataDecoder.decode(testBoolean)).toBe(testBoolean);
  });

  it('failed primitive decoding', async function () {
    stringDataDecoder.decode(testBoolean).catch((error) => expect(error instanceof Error).toBeTruthy());
    numberDataDecoder.decode(testString).catch((error) => expect(error instanceof Error).toBeTruthy());
    booleanDataDecoder.decode(testNumber).catch((error) => expect(error instanceof Error).toBeTruthy());
  });

  it('successful decoding of reference types data', async function () {
    expect(await arrayDataDecoder.decode(testArray)).toEqual(testArray);
    expect(await objectDataDecoder.decode(testObject)).toEqual(testObject);
  });

  it('failed reference types data decoding', function () {
    arrayDataDecoder.decode(testObject).catch((error) => expect(error instanceof Error).toBeTruthy());
    objectDataDecoder.decode(testArray).catch((error) => expect(error instanceof Error).toBeTruthy());
  });
});
