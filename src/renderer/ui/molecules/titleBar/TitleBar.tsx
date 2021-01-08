import React, { FC, ReactNode } from 'react';
import { Flex, FlexProps, IconButton } from '@chakra-ui/core';
import './TitleBar.css';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { AppSystemEvents } from '../../../../shared/types/system';
import { Text } from '../../atoms/text/Text';
import { usePlatform } from '../../../app/system/hooks/usePlatform';
import { Heading } from '../../atoms/heading/Heading';

export interface TitleBarProps extends FlexProps {
  pageTitle?: ReactNode;
}

export const titleBarHeight = '40px';

export const TitleBar: FC<TitleBarProps> = ({
  children,
  pageTitle,
  ...props
}) => {
  const { is } = usePlatform();

  const [closeWindow] = useIpcInvoke(AppSystemEvents.CloseWindow);
  const [minimizeWindow] = useIpcInvoke(AppSystemEvents.MinimizeWindow);

  return (
    <Flex
      alignItems="center"
      justifyContent="flex-end"
      position="absolute"
      className="title-bar"
      h={titleBarHeight}
      w="100%"
      {...props}
    >
      {pageTitle && (
        <Heading
          size="md"
          top={4}
          position="absolute"
          textAlign="center"
          w="100%"
        >
          {pageTitle}
        </Heading>
      )}
      {children}
      {is.windows && (
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
