import React, { FC, ReactNode } from 'react';
import { Box, BoxProps, Flex, IconButton } from '@chakra-ui/core';
import './TitleBar.css';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { AppSystemOperations } from '../../../../shared/types/system';
import { Text } from '../../atoms/text/Text';
import { usePlatform } from '../../../app/system/hooks/usePlatform';
import { Heading } from '../../atoms/heading/Heading';

export interface TitleBarProps extends BoxProps {
  pageTitle?: ReactNode;
  actionOnClose?: 'quit' | 'closeWindow';
}

export const titleBarHeight = '40px';

export const TitleBar: FC<TitleBarProps> = ({
  children,
  pageTitle,
  actionOnClose = 'quit',
  ...props
}) => {
  const { is } = usePlatform();

  const quitAppMutation = useIpcMutation<void>(AppSystemOperations.QuitApp);
  const closeWindowMutation = useIpcMutation<void>(
    AppSystemOperations.CloseWindow
  );
  const minimizeWindowMutation = useIpcMutation<void>(
    AppSystemOperations.MinimizeWindow
  );

  return (
    <Box
      width="100%"
      className="title-bar"
      h={titleBarHeight}
      position="absolute"
      as="header"
      {...props}
    >
      <Box className="draggable" />
      <Flex
        height="100%"
        alignItems="center"
        justifyContent="flex-end"
        w="100%"
        zIndex="10"
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
        {is?.windows && (
          <Flex position="absolute" right={1}>
            <IconButton
              className="minimize"
              aria-label="Minimize window"
              onClick={() => minimizeWindowMutation.mutate()}
              variant="ghost"
            >
              <Text>_</Text>
            </IconButton>
            <IconButton
              className={actionOnClose === 'quit' ? 'quit' : 'close'}
              aria-label={
                actionOnClose === 'quit' ? 'Quit app' : 'Close window'
              }
              onClick={() =>
                actionOnClose === 'quit'
                  ? quitAppMutation.mutate()
                  : closeWindowMutation.mutate()
              }
              variant="ghost"
            >
              <Text>X</Text>
            </IconButton>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
