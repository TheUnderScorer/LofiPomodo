import React, { FC } from 'react';
import { Flex, FlexProps, IconButton } from '@chakra-ui/core';
import './TitleBar.css';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { Text } from '../../atoms/text/Text';
import { usePlatform } from '../../../app/system/hooks/usePlatform';

export interface TitleBarProps extends FlexProps {}

export const TitleBar: FC<TitleBarProps> = ({ children, ...props }) => {
  const platform = usePlatform();

  const [closeWindow] = useIpcInvoke(AppSystemEvents.CloseWindow);
  const [minimizeWindow] = useIpcInvoke(AppSystemEvents.MinimizeWindow);

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
        <Flex position="absolute" right={1}>
          <IconButton
            className="minimize"
            aria-label="Minimize window"
            onClick={() => minimizeWindow()}
            variant="ghost"
          >
            <Text>_</Text>
          </IconButton>
          <IconButton
            className="close"
            aria-label="Close window"
            onClick={() => closeWindow()}
            variant="ghost"
          >
            <Text>X</Text>
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
};
