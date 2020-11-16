import React, { FC } from 'react';
import { Flex, FlexProps, IconButton } from '@chakra-ui/core';
import './TitleBar.css';
import { getPlatform } from '../../../../shared/platform/getPlatform';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { Text } from '../../atoms/text/Text';

export interface TitleBarProps extends FlexProps {}

export const TitleBar: FC<TitleBarProps> = ({ children, ...props }) => {
  const platform = getPlatform();

  const [closeWindow] = useIpcInvoke(AppSystemEvents.CloseWindow);

  return (
    <Flex
      alignItems="center"
      justifyContent="flex-end"
      position="absolute"
      className="title-bar"
      h="40px"
      w="100%"
      {...props}
    >
      {children}
      {platform === 'win32' && (
        <IconButton
          className="close"
          aria-label="Close window"
          onClick={() => closeWindow()}
          variant="ghost"
        >
          <Text>X</Text>
        </IconButton>
      )}
    </Flex>
  );
};
