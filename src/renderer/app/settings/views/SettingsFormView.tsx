import React, { useCallback, useMemo, useState } from 'react';
import { TitleBar } from '../../../ui/molecules/titleBar/TitleBar';
import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  HStack,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { usePlatform } from '../../system/hooks/usePlatform';
import { Text } from '../../../ui/atoms/text/Text';
import {
  AppSettings,
  SettingsOperations,
} from '../../../../shared/types/settings';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { PomodoroForm } from '../../pomodoro/components/pomodoroForm/PomodoroForm';
import { useForm } from 'react-hook-form';
import { IntegrationsForm } from '../../integrations/components/IntegrationsForm';
import { SubmitButton } from '../../../ui/molecules/submitButton/SubmitButton';
import { Alert } from '../../../ui/molecules/alert/Alert';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import { settingsTabIndexArray } from './SettingsFormView.types';
import { GeneralSettings } from '../components/GeneralSettings';
import { useWindowMinSizeOnMount } from '../../../shared/hooks/useWindowMinSizeOnMount';
import {
  defaultWindowHeight,
  timerWindowSize,
} from '../../../../shared/windows/constants';
import { SettingsFormSchema } from '../../../../shared/schema/settings/SettingsFormSchema';
import { useJoifulValidationResolver } from '../../../form/hooks/useJoifulValidationResolver';
import { Loading } from '../../../ui/atoms/loading/Loading';

export const SettingsFormView = () => {
  const history = useHistory();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tab = useMemo(() => settingsTabIndexArray[activeTabIndex], [
    activeTabIndex,
  ]);

  const form = useForm<AppSettings>({
    mode: 'all',
    resolver: useJoifulValidationResolver(SettingsFormSchema),
    shouldUnregister: false,
  });

  const fillForm = useCallback(
    (values?: AppSettings) => {
      form.reset(values);
    },
    [form]
  );

  const { isLoading: queryLoading, data: settings } = useIpcQuery<
    never,
    AppSettings
  >(SettingsOperations.GetSettings, {
    onComplete: fillForm,
  });

  const setSettingsMutation = useIpcMutation<AppSettings, boolean>(
    SettingsOperations.SetSettings,
    {
      invalidateQueries: [
        SettingsOperations.GetSettings,
        SettingsOperations.GetSetting,
      ],
    }
  );

  const handleSubmit = useCallback(
    async (values: AppSettings) => {
      const result = await setSettingsMutation.mutateAsync(values);

      if (result) {
        history.goBack();
      }
    },
    [setSettingsMutation, history]
  );

  const { is } = usePlatform();

  useWindowMinSizeOnMount({
    minHeight: defaultWindowHeight,
    minWidth: is?.windows ? timerWindowSize + 100 : undefined,
  });

  return (
    <>
      <TitleBar
        backgroundColor="brand.bg"
        position="relative"
        justifyContent="flex-start"
        pt={!is?.windows ? '60px' : 2}
        pl={2}
      >
        <Center flex={1}>
          <Tabs index={activeTabIndex} onChange={setActiveTabIndex}>
            <TabList>
              <Tab id="general_tab">
                <Text>General</Text>
              </Tab>
              <Tab id="pomodoro_tab">
                <Text>Pomodoro</Text>
              </Tab>
              <Tab className="integrations-tab" id="integrations_tab">
                <Text>Integrations</Text>
              </Tab>
            </TabList>
          </Tabs>
        </Center>
      </TitleBar>
      <Container
        pl={0}
        pr={0}
        pt={12}
        pb={0}
        id="settings"
        height={is?.windows ? 'calc(100vh - 40px)' : 'calc(100vh - 60px)'}
        centerContent
        width="100%"
        maxW="100%"
      >
        {queryLoading && (
          <Center height="100%" width="100%">
            <Loading />
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
              pb={4}
              pr={6}
              pl={6}
            >
              {setSettingsMutation.error && (
                <Alert type="error" mb={6}>
                  <Text>{setSettingsMutation.error.message}</Text>
                </Alert>
              )}
              {tab === 'General' && (
                <GeneralSettings settings={settings} form={form} />
              )}
              {tab === 'Pomodoro' && (
                <PomodoroForm
                  settings={settings?.pomodoroSettings!}
                  form={form}
                />
              )}
              {tab === 'Integrations' && <IntegrationsForm form={form} />}
            </Flex>
            <Divider />
            <HStack
              w="100%"
              h="60px"
              justifyContent="center"
              alignItems="center"
              spacing={4}
            >
              <Button onClick={() => history.goBack()} className="go-back-btn">
                <Text>Cancel</Text>
              </Button>

              <SubmitButton
                id="submit_settings"
                isLoading={setSettingsMutation.isLoading}
              />
            </HStack>
          </Flex>
        )}
      </Container>
    </>
  );
};
