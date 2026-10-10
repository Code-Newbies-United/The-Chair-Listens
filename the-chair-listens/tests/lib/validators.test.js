import { describe, expect, test } from '@jest/globals';
import { validateResponse } from '@/lib/validators';

describe('response validation', () => {
  test('rejects an invalid response', () => {
    // Replace this with an input that the actual
    // validateResponse implementation rejects.
    expect(validateResponse(/* invalid input */)).toBe(false);
  });
});