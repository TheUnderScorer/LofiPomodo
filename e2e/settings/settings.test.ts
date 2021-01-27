import { bootstrapTestApp } from '../setup';
import { wait } from '../../src/shared/utils/timeout';
import {
  assertFieldProperty,
  assertFieldValue,
  durationFieldCallback,
  inputFieldCallback,
  switchFieldCallback,
} from '../helpers/fields';
import { FieldsTestCaseHandler } from '../helpers/FieldsTestCaseHandler';

describe('Settings - as a user', () => {
  it('I should be able to fill settings', async () => {
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
          selector: '[name="pomodoroSettings.longBreakInterval"] input',
          setValueCallback: inputFieldCallback('5'),
          checkValueCallback: assertFieldValue('5'),
        },
        openFullWindowOnBreak: {
          selector: '[name="pomodoroSettings.openFullWindowOnBreak"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertFieldProperty('checked', true),
        },
        autoRunBreak: {
          selector: '[name="pomodoroSettings.autoRunBreak"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertFieldProperty('checked', true),
        },
        autoRunWork: {
          selector: '[name="pomodoroSettings.autoRunWork"]',
          setValueCallback: switchFieldCallback(),
          checkValueCallback: assertFieldProperty('checked', true),
        },
      },
      app
    );

    let settingsBtn = await app.client.$('.settings-btn');

    await settingsBtn.click();

    await fieldHandler.waitForField('workDurationSeconds');
    await fieldHandler.setAllFields();

    const submitBtn = await app.client.$('#submit_settings');

    await submitBtn.click();

    await wait(100);

    const timer = await app.client.$('#timer');
    expect(await timer.isDisplayed()).toEqual(true);

    settingsBtn = await app.client.$('.settings-btn');
    await settingsBtn.click();

    await fieldHandler.waitForField('workDurationSeconds');

    await wait(1000);

    await fieldHandler.assertAllFields();
  });
});
