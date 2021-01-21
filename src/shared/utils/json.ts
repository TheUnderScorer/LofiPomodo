import { Jsonable } from '../types/json';

export type StringifiedFields<T, Keys extends keyof T> = Omit<T, Keys> &
  {
    [Key in Keys]?: string;
  };

export type UnStringifiedFields<T extends object, Keys extends keyof T> = Omit<
  T,
  Keys
> &
  {
    [Key in Keys]?: T[Key] extends string ? any : never;
  };

export const stringifyFields = <T extends object, Key extends keyof T>(
  obj: T,
  keys: Key[]
): StringifiedFields<T, Key> => {
  const entries = Object.entries(obj) as [keyof T, any][];

  const mappedEntries = entries.map(([key, value]) => {
    if (!keys.includes(key as Key)) {
      return [key, value];
    }

    return [key, value ? JSON.stringify(value) : undefined];
  });

  return Object.fromEntries(mappedEntries);
};

export const parseStringFields = <T extends object, Key extends keyof T>(
  obj: T,
  keys: Key[]
): UnStringifiedFields<T, Key> => {
  const entries = Object.entries(obj) as [keyof T, any][];

  const mappedEntries = entries.map(([key, value]) => {
    if (!keys.includes(key as Key)) {
      return [key, value];
    }

    return [key, value ? JSON.parse(value) : undefined];
  });

  return Object.fromEntries(mappedEntries);
};

export const toJson = <T extends object>(json: Jsonable<T>) => json.toJSON();

export const isJsonable = <T extends object>(val: any): val is Jsonable<T> => {
  return typeof val === 'object' && typeof val.toJSON === 'function';
};
