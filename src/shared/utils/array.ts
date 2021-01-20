export const castAsArray = <T>(item: T): T[] => {
  return Array.isArray(item) ? item : [item];
};

export const uniqueArray = <T>(array: T[]): T[] => Array.from(new Set(array));
