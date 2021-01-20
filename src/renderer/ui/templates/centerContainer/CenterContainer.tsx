import React, { FC } from 'react';
import { Container, ContainerProps } from '@chakra-ui/core';

export interface CenterContainerProps extends ContainerProps {
  className?: string;
}

export const CenterContainer: FC<CenterContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Container
      pl={0}
      pr={0}
      height="100vh"
      centerContent
      width="100%"
      maxW="100%"
      {...props}
    >
      {children}
    </Container>
  );
};
