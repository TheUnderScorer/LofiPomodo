import * as jf from 'joiful';

export const duration = () =>
  jf.number().integer().min(1).max(999999).required();
