import { getErrorMessage } from '../src/lib';

describe('getErrorMessage', function () {
  it('should receive a message like string', () => {
    expect(getErrorMessage(BigInt(9007199254740991))).toBe(String(BigInt(9007199254740991)));
    expect(getErrorMessage({ bigint: BigInt(9007199254740991) })).toBe(String({ bigint: BigInt(9007199254740991) }));
  });

  it('should receive a message from object with string message property', () => {
    expect(getErrorMessage({ message: 'Error message' })).toBe('Error message');
  });

  it('should receive a message like JSON.stringify', () => {
    expect(getErrorMessage('Error message')).toBe(JSON.stringify('Error message'));
    expect(getErrorMessage([{ message: 'Error message' }, { message: 'Error message' }])).toBe(
      JSON.stringify([{ message: 'Error message' }, { message: 'Error message' }], null, 2)
    );
  });
});
