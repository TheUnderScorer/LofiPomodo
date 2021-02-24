import React, { FC } from 'react';
import {
  Heading as BaseHeading,
  HeadingProps as BaseHeadingProps,
} from '@chakra-ui/react';

export interface HeadingProps extends BaseHeadingProps {}

export const Heading: FC<HeadingProps> = ({ ...props }) => {
  return <BaseHeading {...props} color={props.color ?? 'brand.textPrimary'} />;
};
