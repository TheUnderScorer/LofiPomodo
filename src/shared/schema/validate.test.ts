import * as jf from 'joiful';
import { validate } from './validate';
import { ValidationError } from './ValidationError';

class Schema {
  @(jf.number().required().integer())
  intValue!: number;

  @(jf.string().email().optional())
  email?: string;
}

describe('validate', () => {
  it('should throw error if validation fails', () => {
    const input = {};

    expect(() => validate(input, Schema)).toThrow(ValidationError);
  });

  it('should not throw if validation succeeds', () => {
    const input = new Schema();

    input.intValue = 5;
    input.email = 'test@test.com';

    expect(() => validate(input, Schema)).not.toThrow();
  });
});
