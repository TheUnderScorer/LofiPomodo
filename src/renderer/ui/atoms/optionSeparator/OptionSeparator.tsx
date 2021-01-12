import React, { FC } from 'react';

export interface OptionSeparatorProps {}

export const OptionSeparator: FC<OptionSeparatorProps> = () => {
  return <option disabled>──────────</option>;
};
