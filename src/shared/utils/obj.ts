import { PrefixProperties } from '../types';

export const prefixProperties = <
  T extends Record<string, any>,
  Prefix extends string
>(
  prefix: Prefix,
  obj: T
): PrefixProperties<T, Prefix> => {
  const entries = Object.entries(obj);

  const mappedEntries = entries.map(([key, val]) => [`${prefix}${key}`, val]);

  return Object.fromEntries(mappedEntries);
};
