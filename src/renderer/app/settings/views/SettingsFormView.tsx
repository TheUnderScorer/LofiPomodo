import React, { FC, useCallback, useMemo, useState } from 'react';
import { TitleBar } from '../../../ui/molecules/titleBar/TitleBar';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Spinner,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/core';
import { ArrowIcon } from '../../../ui/atoms/icons';
import { useHistory } from 'react-router-dom';
import { usePlatform } from '../../system/hooks/usePlatform';
import { Text } from '../../../ui/atoms/text/Text';
import './SettingsFormView.styles.css';
import { AppSettings, SettingsEvents } from '../../../../shared/types/settings';
import { useIpcInvoke } from '../../../shared/ipc/useIpcInvoke';
import { PomodoroForm } from '../../pomodoro/components/pomodoroForm/PomodoroForm';
import { useForm } from 'react-hook-form';
import { IntegrationsForm } from '../../integrations/components/IntegrationsForm';

type SettingTab = 'Pomodoro' | 'Integrations';

const tabIndexArray: SettingTab[] = ['Pomodoro', 'Integrations'];

export interface SettingsFormViewProps {}

export const SettingsFormView: FC<SettingsFormViewProps> = () => {
  const history = useHistory();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tab = useMemo(() => tabIndexArray[activeTabIndex], [activeTabIndex]);

  const form = useForm<AppSettings>({
    mode: 'all',
  });

  const fillForm = useCallback(
    (values?: AppSettings) => {
      form.reset(values);
    },
    [form]
  );

  const [, { result: settings, loading: queryLoading }] = useIpcInvoke<
    never,
    AppSettings
  >(SettingsEvents.GetSettings, {
    invokeAtMount: true,
    onComplete: fillForm,
  });

  const [setSettings, { loading, error }] = useIpcInvoke<AppSettings, boolean>(
    SettingsEvents.SetSettings
  );

  const handleSubmit = useCallback(
    async (values: AppSettings) => {
      const result = await setSettings(values);

      if (result) {
        history.goBack();
      }
    },
    [setSettings, history]
  );

  const platform = usePlatform();

  return (
    <>
      <TitleBar
        position="relative"
        justifyContent="flex-start"
        pt={platform !== 'win32' ? '60px' : 2}
        pl={2}
      >
        <Flex w="100%" position="relative">
          <IconButton
            className="go-back-btn"
            left="0"
            top={platform === 'win32' ? 1 : 0}
            onClick={() => history.goBack()}
            aria-label="Go back"
          >
            <ArrowIcon height="20px" width="20px" iconDirection="right" />
          </IconButton>
          <Center flex="1">
            <Tabs index={activeTabIndex} onChange={setActiveTabIndex}>
              <TabList>
                <Tab>
                  <Text>Pomodoro</Text>
                </Tab>
                <Tab>
                  <Text>Integrations</Text>
                </Tab>
              </TabList>
            </Tabs>
          </Center>
        </Flex>
      </TitleBar>
      <Container
        pl={0}
        pr={0}
        pt={12}
        pb={3}
        id="settings"
        height={platform === 'win32' ? '100vh' : 'calc(100vh - 60px)'}
        centerContent
        width="100%"
        maxW="100%"
      >
        {queryLoading && (
          <Center height="100%" width="100%">
            <Spinner color="brand.primary" />
          </Center>
        )}
        {settings && !queryLoading && (
          <Flex
            onSubmit={form.handleSubmit(handleSubmit)}
            as="form"
            height="100%"
            width="100%"
            alignItems="center"
            direction="column"
          >
            <Flex
              direction="column"
              alignItems="center"
              overflow="auto"
              flex={1}
              width="100%"
              pt={2}
            >
              {error && (
                <Alert backgroundColor="brand.danger" status="error" mb={6}>
                  <AlertIcon />
                  <AlertDescription>
                    <Text>{error.message}</Text>
                  </AlertDescription>
                </Alert>
              )}
              {tab === 'Pomodoro' && <PomodoroForm form={form} />}
              {tab === 'Integrations' && <IntegrationsForm form={form} />}
            </Flex>
            {tab === 'Pomodoro' && (
              <Button
                id="submit_settings"
                type="submit"
                minWidth="150px"
                isLoading={loading}
                backgroundColor="brand.primary"
              >
                <Text>Save</Text>
              </Button>
            )}
          </Flex>
        )}
      </Container>
    </>
  );
};
