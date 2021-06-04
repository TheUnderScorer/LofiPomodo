import { duration } from './duration';
import { validate } from '../validate';

class Schema {
  @duration()
  val!: number;
}

describe('duration schema decorator', () => {
  it('should cast to number', () => {
    const input = {
      val: '2',
    };

    const result = validate(input, Schema);

    expect(result.val).toEqual(2);
  });
});
