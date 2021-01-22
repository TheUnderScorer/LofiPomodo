import { Element } from 'webdriverio';
import { SpectronClient } from 'spectron';

export type FieldCallback = (
  el: Element,
  client: SpectronClient,
  value?: any
) => Promise<void>;
export const durationFieldCallback = (
  value: number | string
): FieldCallback => async (field) => {
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

export const switchFieldCallback = (): FieldCallback => async (
  field,
  client
) => {
  const name = await field.getAttribute('name');
  const label = await client.$(`label[for="${name}"]`);

  await label.click();
};

export const checkboxFieldCallback = (): FieldCallback => async (field) => {
  const label = await field.parentElement();

  await label.click();
};

export const selectFieldCallback = (value: string): FieldCallback => async (
  field
) => {
  return setSelectValue(field, value);
};

export const assertFieldValue = (
  value: string | number
): FieldCallback => async (field) => {
  const fieldValue = await field.getValue();

  expect(fieldValue).toEqual(value);
};

export const assertFieldProperty = (
  prop: string,
  value: any
): FieldCallback => async (field) => {
  const propValue = await field.getProperty(prop);

  expect(propValue).toEqual(value);
};

export const setSelectValue = async (
  element: WebdriverIO.Element,
  value: string
) => {
  const option = await element.$(`option[value="${value}"]`);

  await option.click();
};

export interface FieldTestCase {
  setValueCallback: FieldCallback;
  checkValueCallback: FieldCallback;
  selector: string;
}