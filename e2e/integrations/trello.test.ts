import { bootstrapTestApp } from '../setup';
import { manageIntegration } from './utils';
import { ApiProvider } from '../../src/shared/types/integrations/integrations';
import { wait } from '../../src/shared/utils/timeout';
import { waitForElement } from '../helpers/waitForElement';
import {
  assertFieldProperty,
  assertFieldValue,
  checkboxFieldCallback,
  selectFieldCallback,
} from '../helpers/fields';
import { FieldsTestCaseHandler } from '../helpers/FieldsTestCaseHandler';

describe('Trello integrations - as a user', () => {
  it('I should be able to set lists from which tasks will be fetched', async () => {
    const app = await bootstrapTestApp();

    const handler = new FieldsTestCaseHandler(
      {
        boardSelect: {
          setValueCallback: selectFieldCallback('5db458450b635a2ed727fb37'),
          checkValueCallback: assertFieldValue('5db458450b635a2ed727fb37'),
          selector: '[name="boards[0].boardId"]',
        },
        doneListIdSelect: {
          setValueCallback: selectFieldCallback('5db4586112dbc836efc3ea73'),
          checkValueCallback: assertFieldValue('5db4586112dbc836efc3ea73'),
          selector: '[name="boards[0].doneListId"]',
        },
        listCheckbox: {
          setValueCallback: checkboxFieldCallback(),
          checkValueCallback: assertFieldProperty('checked', true),
          selector: 'input[value="5db4585c1fcf6c7425074aa2"]',
        },
      },
      app
    );

    await manageIntegration(ApiProvider.Trello, app);

    await wait(1000);

    await app.client.windowByIndex(1);

    await handler.waitForField('boardSelect');
    await handler.setFieldValue('boardSelect');

    await waitForElement(handler.getSelector('listCheckbox'), app.client);

    await handler.setAllFields();

    const submitBtn = await app.client.$('#submit_trello');
    await submitBtn.click();

    await wait(2000);

    await app.client.refresh();

    await handler.assertAllFields();
  });
});
