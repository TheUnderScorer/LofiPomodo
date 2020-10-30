export const castAsArray = <T>(item: T): T[] => {
  return Array.isArray(item) ? item : [item];
};
