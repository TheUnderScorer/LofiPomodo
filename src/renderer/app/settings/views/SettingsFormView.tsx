import React, { FC, useCallback, useMemo, useState } from 'react';
import { TitleBar } from '../../../ui/molecules/titleBar/TitleBar';
import {
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
import { useYupValidationResolver } from '../../../form/hooks/useYupValidationResolver';
import Yup from '../../../../shared/schema/yup';
import { pomodoroSettingsSchemaShape } from '../../../../shared/schema/pomodoro/pomodoroSettings';
import {
  SettingsFormInput,
  SettingsFormViewProps,
  SettingTab,
} from './SettingsFormView.types';

const tabIndexArray: SettingTab[] = ['Pomodoro', 'Integrations'];

const formSchema = Yup.object().shape<SettingsFormInput & any>({
  autoStart: Yup.boolean().required(),
  pomodoroSettings: Yup.object().shape(pomodoroSettingsSchemaShape),
});

export const SettingsFormView: FC<SettingsFormViewProps> = () => {
  const history = useHistory();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tab = useMemo(() => tabIndexArray[activeTabIndex], [activeTabIndex]);

  const form = useForm<AppSettings>({
    mode: 'all',
    resolver: useYupValidationResolver(formSchema),
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

  console.log({
    errors: form.errors,
  });

  return (
    <>
      <TitleBar
        position="relative"
        justifyContent="flex-start"
        pt={!is?.windows ? '60px' : 2}
        pl={2}
      >
        <Flex w="100%" position="relative">
          <IconButton
            className="go-back-btn"
            left="0"
            top={is?.windows ? 1 : 0}
            onClick={() => history.goBack()}
            aria-label="Go back"
          >
            <ArrowIcon height="20px" width="20px" iconDirection="right" />
          </IconButton>
          <Center flex="1">
            <Tabs index={activeTabIndex} onChange={setActiveTabIndex}>
              <TabList>
                <Tab id="pomodoro_tab">
                  <Text>Pomodoro</Text>
                </Tab>
                <Tab className="integrations-tab" id="integrations_tab">
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
        height={is?.windows ? 'calc(100vh - 40px)' : 'calc(100vh - 60px)'}
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
              {setSettingsMutation.error && (
                <Alert type="error" mb={6}>
                  <Text>{setSettingsMutation.error.message}</Text>
                </Alert>
              )}
              {tab === 'Pomodoro' && (
                <PomodoroForm
                  settings={{
                    ...settings?.pomodoroSettings!,
                    autoStart: settings.autoStart,
                  }}
                  form={form}
                />
              )}
              {tab === 'Integrations' && <IntegrationsForm form={form} />}
            </Flex>
            {tab === 'Pomodoro' && (
              <SubmitButton
                id="submit_settings"
                isLoading={setSettingsMutation.isLoading}
              />
            )}
          </Flex>
        )}
      </Container>
    </>
  );
};
