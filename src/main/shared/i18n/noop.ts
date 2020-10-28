export const noop = (value: number, singular: string, plural: string) => {
  return value > 1 ? plural : singular;
};
