import { bootstrapTestApp } from '../setup';
import { wait } from '../../src/shared/utils/timeout';
import {
  assertFieldProperty,
  assertFieldValue,
  assertSwitchField,
  durationFieldCallback,
  inputFieldCallback,
  switchFieldCallback,
} from '../helpers/fields';
import { FieldsTestCaseHandler } from '../helpers/FieldsTestCaseHandler';
import { goToSettings, saveSettings } from '../integrations/utils';

describe('Settings - as a user', () => {
  it('I should be able to fill pomodoro settings', async () => {
    const app = await bootstrapTestApp({
      SHORT_BREAK_DURATION_SECONDS: 120,
      LONG_BREAK_DURATION_SECONDS: 120,
      WORK_DURATION_SECONDS: 120,
    });

    const fieldHandler = new FieldsTestCaseHandler(
      {
        workDurationSeconds: {
          selector: '[name="pomodoroSettings.workDurationSeconds"]',
          setValueCallback: durationFieldCallback('25'),
          checkValueCallback: assertFieldValue('25'),
        },
        shortBreakDurationSeconds: {
          selector: '[name="pomodoroSettings.shortBreakDurationSeconds"]',
          setValueCallback: durationFieldCallback('5'),
          checkValueCallback: assertFieldValue('5'),
        },
        longBreakDurationSeconds: {
          selector: '[name="pomodoroSettings.longBreakDurationSeconds"]',
          setValueCallback: durationFieldCallback('10'),
          checkValueCallback: assertFieldValue('10'),
        },
        longBreakInterval: {
          selector: '[name="pomodoroSettings.longBreakInterval"]',
          setValueCallback: inputFieldCallback('5'),
          checkValueCallback: assertFieldValue('5'),
        },
        openFullWindowOnBreak: {
          selector: '[name="pomodoroSettings.openFullWindowOnBreak"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertSwitchField(true),
        },
        autoRunBreak: {
          selector: '[name="pomodoroSettings.autoRunBreak"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertSwitchField(true),
        },
        autoRunWork: {
          selector: '[name="pomodoroSettings.autoRunWork"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertSwitchField(true),
        },
      },
      app
    );

    await goToSettings(app, 'Pomodoro');

    await fieldHandler.waitForField('workDurationSeconds');
    await fieldHandler.setAllFields();

    await saveSettings(app);

    const timer = await app.client.$('#timer');
    expect(await timer.isDisplayed()).toEqual(true);

    await goToSettings(app, 'Pomodoro');

    await fieldHandler.waitForField('workDurationSeconds');

    await wait(1000);

    await fieldHandler.assertAllFields();
  });

  it('I should be able to edit general settings', async () => {
    const app = await bootstrapTestApp({
      SHORT_BREAK_DURATION_SECONDS: 120,
      LONG_BREAK_DURATION_SECONDS: 120,
      WORK_DURATION_SECONDS: 120,
    });

    let toggleTasksBtn = await app.client.$('.toggle-tasks-list-btn');

    expect(await toggleTasksBtn.isExisting()).toEqual(false);

    const testCaseHandler = new FieldsTestCaseHandler(
      {
        toggleTaskListSwitch: {
          selector: '[name="taskSettings.showToggleTaskListBtn"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertSwitchField(true),
        },
      },
      app
    );

    await goToSettings(app, 'General');

    await testCaseHandler.waitForField('toggleTaskListSwitch');
    await testCaseHandler.setAllFields();

    await saveSettings(app);

    toggleTasksBtn = await app.client.$('.toggle-tasks-list-btn');

    expect(await toggleTasksBtn.isExisting()).toEqual(true);

    await goToSettings(app, 'General');

    await testCaseHandler.waitForField('toggleTaskListSwitch');
    await testCaseHandler.assertAllFields();
  });
});
