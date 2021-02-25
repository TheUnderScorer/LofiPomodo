import { BaseSchema } from '../../../shared/schema/BaseSchema';
import * as jf from 'joiful';
import { renderHook } from '@testing-library/react-hooks';
import { useJoifulValidationResolver } from './useJoifulValidationResolver';

class Schema extends BaseSchema<Schema> {
  @(jf.number().positive().required())
  intValue!: number;
}

describe('useJoifulValidationResolver', () => {
  it('should handle failed validation', async () => {
    const input = {};

    const hook = renderHook(() => useJoifulValidationResolver(Schema));

    const result = await hook.result.current(input);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "errors": Object {
          "intValue": Object {
            "message": "\\"intValue\\" is required",
            "type": "any.required",
          },
        },
        "values": Object {},
      }
    `);
  });

  it('should handle successful validation', async () => {
    const input: Schema = {
      intValue: 5,
    };

    const hook = renderHook(() => useJoifulValidationResolver(Schema));

    const result = await hook.result.current(input);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "errors": Object {},
        "values": Object {
          "intValue": 5,
        },
      }
    `);
  });
});
