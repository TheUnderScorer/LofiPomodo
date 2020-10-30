import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';
import { AppStore } from '../shared/types/store';
import { PomodoroService } from './app/pomodoro/services/PomodoroService';
import path from 'path';
import { WindowFactory } from './shared/windows/factories/WindowFactory';
import AutoLaunch from 'auto-launch';
import { app } from 'electron';
import { setupConnection } from './shared/database/connection';
import { TaskRepository } from './app/tasks/repositories/TaskRepository';
import { Tables } from '../shared/types/database';
import { TasksService } from './app/tasks/services/TasksService';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService;
  preloadPath: string;
  windowFactory: WindowFactory;
  autoLaunch: AutoLaunch;
  tasksService: TasksService;
  taskRepository: TaskRepository;
}

export const createContext = async (): Promise<AppContext> => {
  const connection = await setupConnection();
  const taskRepository = new TaskRepository(connection, Tables.Tasks);

  await connection.migrate.latest();

  const tasksService = new TasksService(taskRepository);

  const preload = path.join(__dirname, 'preload.js');
  const store = new ElectronStore<AppStore>();
  const pomodoro = new PomodoroService(store);
  const windowFactory = new WindowFactory(preload);

  return {
    ipcService: new IpcMainService(),
    taskRepository,
    store,
    pomodoro,
    preloadPath: preload,
    windowFactory,
    tasksService,
    autoLaunch: new AutoLaunch({
      isHidden: true,
      name: app.getName(),
    }),
  };
};
