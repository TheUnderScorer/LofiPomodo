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
import { TaskCrudService } from './app/tasks/services/TaskCrudService';
import fs from 'fs';
import { MenuFactory } from './shared/menu/MenuFactory';
import { SettingsService } from './app/settings/services/SettingsService';
import { TrelloClient } from './app/integrations/trello/TrelloClient';
import fetch from 'node-fetch';
import { TrelloService } from './app/integrations/trello/TrelloService';
import { ApiAuthService } from './app/integrations/services/ApiAuthService';
import { ApiAuthState } from './app/integrations/services/ApiAuthState';
import { ApiService } from './app/integrations/types';
import { ContextMenuFactory } from './shared/menu/ContextMenuFactory';
import { TrelloTasksService } from './app/tasks/services/TrelloTasksService';
import { TaskSynchronizer } from './app/tasks/services/TaskSynchronizer';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService;
  preloadPath: string;
  windowFactory: WindowFactory;
  menuFactory: MenuFactory;
  contextMenuFactory: ContextMenuFactory;
  autoLaunch: AutoLaunch;
  taskCrudService: TaskCrudService;
  taskRepository: TaskRepository;
  settingsService: SettingsService;
  trelloClient: TrelloClient;
  trelloService: TrelloService;
  apiAuthService: ApiAuthService;
  apiAuthState: ApiAuthState;
  taskSynchronizer: TaskSynchronizer;
}

const handleIntegrations = async (
  store: ElectronStore<AppStore>,
  windowFactory: WindowFactory,
  trelloClient: TrelloClient
) => {
  const trelloService = new TrelloService(store, trelloClient);
  const apiServices: ApiService[] = [trelloService];
  const apiAuthState = new ApiAuthState(windowFactory, apiServices);
  const apiAuthService = new ApiAuthService(apiServices, apiAuthState);

  if (process.env.TRELLO_TOKEN) {
    await trelloService.setUserToken(process.env.TRELLO_TOKEN);
  }

  return { trelloService, apiAuthState, apiAuthService };
};

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

  const taskCrudService = new TaskCrudService(taskRepository);

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

  const trelloClient = new TrelloClient(
    process.env.TRELLO_API_KEY!,
    process.env.TRELLO_REDIRECT_URL!,
    fetch
  );

  const {
    trelloService,
    apiAuthState,
    apiAuthService,
  } = await handleIntegrations(store, windowFactory, trelloClient);

  const taskApiServices = [
    new TrelloTasksService(trelloService, taskRepository, taskCrudService),
  ];
  const taskSynchronizer = new TaskSynchronizer(taskApiServices, store);

  return {
    ipcService: new IpcMainService(),
    taskRepository,
    store,
    pomodoro,
    preloadPath: preload,
    windowFactory,
    menuFactory,
    taskCrudService,
    autoLaunch,
    settingsService: new SettingsService(pomodoro, autoLaunch, store),
    trelloClient,
    trelloService,
    apiAuthService,
    apiAuthState,
    contextMenuFactory: new ContextMenuFactory(pomodoro),
    taskSynchronizer,
  };
};
