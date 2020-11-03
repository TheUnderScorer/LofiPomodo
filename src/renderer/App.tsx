import React from 'react';
import { Container, useColorMode } from '@chakra-ui/core';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../shared/routes/routes';
import { PomodoroView } from './app/pomodoro/views/PomodoroView';
import { usePomodoroListeners } from './app/pomodoro/hooks/usePomodoroListeners';
import './fonts/fonts.css';

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
        <Route exact path={routes.timer()} component={PomodoroView} />
        <Route path={routes.timer(true)}>
          <PomodoroView breakMode />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
