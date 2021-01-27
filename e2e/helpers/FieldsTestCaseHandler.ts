import { Application } from 'spectron';
import { waitForElement } from './waitForElement';
import { FieldTestCase } from './fields.types';

export class FieldsTestCaseHandler<T extends Record<string, FieldTestCase>> {
  constructor(private readonly cases: T, private readonly app: Application) {}

  async setFieldValue(key: keyof T, value?: any) {
    const testCase = this.getCaseByKey(key);

    const element = await this.app.client.$(testCase.selector);

    await testCase.setValueCallback(element, this.app.client, value);
  }

  getSelector(key: keyof T) {
    return this.getCaseByKey(key).selector;
  }

  async waitForField(key: keyof T) {
    await waitForElement(this.getSelector(key), this.app.client);
  }

  getCaseByKey(key: keyof T) {
    const testCase = this.cases[key];

    if (!testCase) {
      throw new TypeError(`No case defined for key ${key}`);
    }

    return testCase;
  }

  async setAllFields() {
    await Promise.all(
      Object.keys(this.cases).map((key) => this.setFieldValue(key))
    );
  }

  async assertAllFields() {
    await Promise.all(
      Object.keys(this.cases).map((key) => this.assertField(key))
    );
  }

  async assertField(key: keyof T, value?: any) {
    const testCase = await this.getCaseByKey(key);
    const element = await this.app.client.$(testCase.selector);

    await testCase.checkValueCallback(element, this.app.client, value);
  }
}
