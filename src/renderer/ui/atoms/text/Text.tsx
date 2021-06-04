import React, { FC } from 'react';
import { Text as BaseText, TextProps as BaseTextProps } from '@chakra-ui/react';

export interface TextProps extends BaseTextProps {}

export const Text: FC<TextProps> = ({ ...props }) => {
  return <BaseText {...props} color={props.color ?? 'brand.textPrimary'} />;
};
