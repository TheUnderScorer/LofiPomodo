import React, { useEffect } from 'react';
import { Container, useColorMode } from '@chakra-ui/core';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../shared/routes/routes';
import { PomodoroView } from './app/pomodoro/views/pomodoroView/PomodoroView';
import { BreakView } from './app/pomodoro/views/breakView/BreakView';
import { SettingsFormView } from './app/settings/views/SettingsFormView';
import { ManageTrelloView } from './app/integrations/views/manageTrelloView/ManageTrelloView';
import './styles/animations.css';
import { useQueryClient } from 'react-query';

const App = () => {
  const { colorMode } = useColorMode();

  const queryClient = useQueryClient();

  useEffect(() => {
    console.log({
      queryCache: queryClient.getQueryCache(),
    });
  });

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
        <Route path={routes.settings()}>
          <SettingsFormView />
        </Route>
        <Route path={routes.manageTrello()}>
          <ManageTrelloView />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
