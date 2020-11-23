import { Application } from 'spectron';

export const createTask = async (app: Application, title = 'Test task') => {
  const input = await app.client.$('#task_title');
  const btn = await app.client.$('#create_task');

  await input.setValue(title);
  await btn.click();
};
