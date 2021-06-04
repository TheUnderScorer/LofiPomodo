import React from 'react';
import { ChakraProps } from '@chakra-ui/system';
import { Icon } from '../icons/Icon';

export interface LoadingProps extends ChakraProps {}

export const Loading = (props: LoadingProps) => {
  return <Icon className="animation-rotate" name="Hourglass" {...props} />;
};
