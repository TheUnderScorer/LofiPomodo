import { bootstrapTestApp } from '../setup';

describe('Tasks list - as an user', () => {
  it('I should be able to add new task', async () => {
    const app = await bootstrapTestApp({
      CLEAR_DB_ON_RUN: true,
    });
    const input = await app.client.$('#task_title');
    const btn = await app.client.$('#create_task');

    await input.setValue('Test Task');
    await btn.click();

    const listItems = await app.client.$$('.task-list-item');
    expect(listItems.length).toBeGreaterThanOrEqual(1);
  });
});
