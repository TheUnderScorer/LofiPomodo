import React from 'react';
import { Container, useColorMode } from '@chakra-ui/core';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../shared/routes/routes';
import { Timer } from './app/pomodoro/components/Timer';
import { usePomodoroListeners } from './app/pomodoro/hooks/usePomodoroListeners';

const App = () => {
  const { colorMode } = useColorMode();

  usePomodoroListeners();

  return (
    <Container
      w="100%"
      pl="0"
      pr="0"
      maxW="100%"
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
    >
      <Switch>
        <Route exact path={routes.timer()} component={Timer} />
        <Route path={routes.timer(true)}>
          <Timer breakMode />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
