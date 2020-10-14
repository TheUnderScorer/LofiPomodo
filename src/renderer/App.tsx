import React from 'react';
import './App.css';
import { Box, Container, useColorMode } from '@chakra-ui/core';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../shared/routes/routes';
import { Timer } from './app/pomodoro/components/Timer';

const App = () => {
  const { colorMode } = useColorMode();

  return (
    <Container
      w="100%"
      pl="0"
      pr="0"
      maxW="100%"
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
    >
      <Box className="title-bar" h="40px" w="100%" />
      <Switch>
        <Route path={routes.timer()} component={Timer} />
      </Switch>
    </Container>
  );
};

export default App;
