import React, { FC } from 'react';
import { Button, Center, Container, Stack } from '@chakra-ui/core';

export interface TimerProps {}

export const Timer: FC<TimerProps> = () => {
  return (
    <Container
      height="calc(100vh - 40px)"
      centerContent
      maxW="sm"
      className="App"
    >
      <Center h="100%" w="100%">
        <Stack w="50%" spacing={4}>
          <Button colorScheme="teal">Hello!</Button>
          <Button size="xs" variant="outline">
            World!
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};
