import * as jf from 'joiful';

export const optionalEnum = (obj: Record<string, string | number>) => () =>
  jf.string().valid(Object.values(obj)).optional();

export const requiredEnum = (obj: Record<string, string | number>) => () =>
  jf.string().valid(Object.values(obj)).required();
