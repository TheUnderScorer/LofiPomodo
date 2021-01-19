import { bootstrapTestApp } from '../setup';
import { Element } from 'webdriverio';
import { wait } from '../../src/shared/utils/timeout';
import { SpectronClient } from 'spectron';

type FieldCallback = (el: Element, client: SpectronClient) => Promise<void>;

const durationFieldCallback = (value: number | string): FieldCallback => async (
  field
) => {
  const parentEl = await field
    .parentElement()
    .then((parent) => parent.parentElement());

  const buttons = await parentEl.$$('[role="button"]');
  const [, decrement] = buttons;

  /**
   * I couldn't find any better way to clear the field, since 'field.clearValue()' was not working :/.
   * So I set every duration field value to 120 seconds (which ends up displayed as "2" minutes) and then click the decrement button twice, to reduce it's value to "0".
   * After that, "field.setValue()" is working correctly.
   * */
  await decrement.click();
  await decrement.click();

  await field.setValue(value);
};

const switchFieldCallback = (): FieldCallback => async (field, client) => {
  const name = await field.getAttribute('name');
  const label = await client.$(`label[for="${name}"]`);

  await label.click();
};

const assertFieldValue = (value: string | number): FieldCallback => async (
  field
) => {
  const fieldValue = await field.getValue();

  expect(fieldValue).toEqual(value);
};

const assertFieldProperty = (prop: string, value: any): FieldCallback => async (
  field
) => {
  const propValue = await field.getProperty(prop);

  expect(propValue).toEqual(value);
};

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

    for (const [name, checker] of Object.entries(fieldChecksMap)) {
      const field = await app.client.$(`[name="pomodoro.${name}"]`);

      await checker(field, app.client);
    }
  });
});
