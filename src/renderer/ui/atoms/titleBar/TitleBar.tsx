import React, { FC } from 'react';
import { Box } from '@chakra-ui/core';
import './TitleBar.css';

export interface TitleBarProps {}

export const TitleBar: FC<TitleBarProps> = () => {
  return <Box position="absolute" className="title-bar" h="40px" w="100%" />;
};
