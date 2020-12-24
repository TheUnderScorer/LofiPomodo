import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';
import { AppStore } from '../shared/types/store';
import { PomodoroService } from './app/pomodoro/services/pomodoroService/PomodoroService';
import path from 'path';
import { WindowFactory } from './shared/windows/factories/WindowFactory';
import AutoLaunch from 'auto-launch';
import { app } from 'electron';
import { getDbPath, setupConnection } from './shared/database/connection';
import { TaskRepository } from './app/tasks/repositories/TaskRepository';
import { Tables } from '../shared/types/database';
import { TasksService } from './app/tasks/services/TasksService';
import fs from 'fs';
import { MenuFactory } from './shared/menu/MenuFactory';
import { SettingsService } from './app/settings/services/SettingsService';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService;
  preloadPath: string;
  windowFactory: WindowFactory;
  menuFactory: MenuFactory;
  autoLaunch: AutoLaunch;
  tasksService: TasksService;
  taskRepository: TaskRepository;
  settingsService: SettingsService;
}

export const createContext = async (): Promise<AppContext> => {
  if (process.env.CLEAR_DB_ON_RUN === 'true') {
    const dbPath = getDbPath();

    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  }

  const connection = await setupConnection();

  const taskRepository = new TaskRepository(connection, Tables.Tasks);

  await connection.migrate.latest();

  const tasksService = new TasksService(taskRepository);

  const preload = path.join(__dirname, 'preload.js');
  const store = new ElectronStore<AppStore>();
  const pomodoro = new PomodoroService(store);

  const menuFactory = new MenuFactory(pomodoro);
  const windowFactory = new WindowFactory(preload, menuFactory, store);

  if (process.env.CLEAR_STORE_ON_APP_RUN === 'true') {
    store.clear();
  }

  const autoLaunch = new AutoLaunch({
    isHidden: true,
    name: app.getName(),
  });

  return {
    ipcService: new IpcMainService(),
    taskRepository,
    store,
    pomodoro,
    preloadPath: preload,
    windowFactory,
    menuFactory,
    tasksService,
    autoLaunch,
    settingsService: new SettingsService(pomodoro, autoLaunch),
  };
};
