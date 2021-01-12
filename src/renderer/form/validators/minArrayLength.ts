export const minArrayLength = (min: number) => (val: any) => {
  return Array.isArray(val) && val.length >= min
    ? true
    : `You need to select at least ${min} item.`;
};
