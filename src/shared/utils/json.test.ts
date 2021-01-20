import { parseStringFields, stringifyFields } from './json';

describe('stringifyFields', () => {
  it('should stringify fields', () => {
    const obj = {
      a: 1,
      b: true,
      c: {
        isObject: true,
      },
    };

    const stringified = stringifyFields(obj, ['c']);

    expect(typeof stringified.a).toBe('number');
    expect(typeof stringified.b).toBe('boolean');
    expect(typeof stringified.c).toBe('string');
    expect(stringified.c).toMatchInlineSnapshot(`"{\\"isObject\\":true}"`);
  });
});

describe('parseStringFields', () => {
  it('should parse string fields', () => {
    const obj = {
      a: 1,
      b: true,
      c: JSON.stringify({ isObject: true }),
    };

    const result = parseStringFields(obj, ['c']);

    expect(typeof result.a).toBe('number');
    expect(typeof result.b).toBe('boolean');
    expect(typeof result.c).toBe('object');
    expect(result.c).toMatchInlineSnapshot(`
      Object {
        "isObject": true,
      }
    `);
  });
});
