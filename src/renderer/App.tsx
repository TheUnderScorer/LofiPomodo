import React from 'react';
import { Container, useColorMode } from '@chakra-ui/core';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../shared/routes/routes';
import { PomodoroView } from './app/pomodoro/views/pomodoroView/PomodoroView';
import { usePomodoroListeners } from './app/pomodoro/hooks/usePomodoroListeners';
import { useTasksListeners } from './app/tasks/hooks/useTaskListeners';
import { BreakView } from './app/pomodoro/views/breakView/BreakView';

const App = () => {
  const { colorMode } = useColorMode();

  usePomodoroListeners();
  useTasksListeners();

  return (
    <Container
      w="100%"
      pl="0"
      pr="0"
      maxW="100%"
      bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
    >
      <Switch>
        <Route exact path={routes.timer()}>
          <PomodoroView />
        </Route>
        <Route path={routes.breakWindow()}>
          <BreakView />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
