import { bootstrapTestApp } from '../setup';
import { wait } from '../../src/shared/utils/timeout';
import {
  assertFieldProperty,
  assertFieldValue,
  durationFieldCallback,
  FieldCallback,
  switchFieldCallback,
} from '../helpers/fields';

describe('Settings - as a user', () => {
  it('I should be able to fill settings', async () => {
    const payloadNameMap: Record<string, FieldCallback> = {
      workDurationSeconds: durationFieldCallback('25'),
      shortBreakDurationSeconds: durationFieldCallback('5'),
      longBreakDurationSeconds: durationFieldCallback('10'),
      openFullWindowOnBreak: switchFieldCallback(),
      autoRunBreak: switchFieldCallback(),
      autoRunWork: switchFieldCallback(),
    };

    const fieldChecksMap: Record<string, FieldCallback> = {
      workDurationSeconds: assertFieldValue('25'),
      shortBreakDurationSeconds: assertFieldValue('5'),
      longBreakDurationSeconds: assertFieldValue('10'),
      openFullWindowOnBreak: assertFieldProperty('checked', true),
      autoRunBreak: assertFieldProperty('checked', true),
      autoRunWork: assertFieldProperty('checked', true),
    };

    const app = await bootstrapTestApp({
      SHORT_BREAK_DURATION_SECONDS: 120,
      LONG_BREAK_DURATION_SECONDS: 120,
      WORK_DURATION_SECONDS: 120,
    });

    let settingsBtn = await app.client.$('.settings-btn');

    await settingsBtn.click();

    for (const [name, handler] of Object.entries(payloadNameMap)) {
      const field = await app.client.$(`[name="pomodoro.${name}"]`);

      await handler(field, app.client);
    }

    const submitBtn = await app.client.$('#submit_settings');

    await submitBtn.click();
    await wait(100);

    const timer = await app.client.$('#timer');
    expect(await timer.isDisplayed()).toEqual(true);

    settingsBtn = await app.client.$('.settings-btn');
    await settingsBtn.click();

    await wait(2000);

    for (const [name, checker] of Object.entries(fieldChecksMap)) {
      const field = await app.client.$(`[name="pomodoro.${name}"]`);

      await checker(field, app.client);
    }
  });
});
