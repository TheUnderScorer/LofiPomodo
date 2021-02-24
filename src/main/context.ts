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
import { ApiAuthStateService } from './app/integrations/services/ApiAuthStateService';
import { ApiService } from './app/integrations/types';
import { ContextMenuFactory } from './shared/menu/ContextMenuFactory';
import { TrelloTasksService } from './app/tasks/services/trelloTaskService/TrelloTasksService';
import { TaskSynchronizer } from './app/tasks/services/TaskSynchronizer';
import { PomodoroSettings, PomodoroState } from '../shared/types';
import {
  getInitialPomodoroSettings,
  getInitialPomodoroState,
} from './app/pomodoro/data';
import { AudioPlayer } from './app/audio/services/AudioPlayer';
import audios from '../assets/audio/audios.json';
import { AppSettings } from '../shared/types/settings';
import { NotificationsService } from './shared/notifications/NotificationsService';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoroService: PomodoroService;
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
  apiAuthState: ApiAuthStateService;
  taskSynchronizer: TaskSynchronizer;
  audioPlayer: AudioPlayer;
  notificationService: NotificationsService;
}

const handleIntegrations = async (
  store: ElectronStore<AppStore>,
  windowFactory: WindowFactory,
  trelloClient: TrelloClient
) => {
  const trelloService = new TrelloService(store, trelloClient);
  const apiServices: ApiService[] = [trelloService];
  const apiAuthState = new ApiAuthStateService(apiServices);
  const apiAuthService = new ApiAuthService(apiServices, apiAuthState);

  if (process.env.TRELLO_TOKEN) {
    await trelloService.setUserToken(process.env.TRELLO_TOKEN);
  }

  return { trelloService, apiAuthState, apiAuthService };
};

const createStore = () => {
  const defaults: AppSettings = {
    pomodoroSettings: getInitialPomodoroSettings(),
    pomodoroState: getInitialPomodoroState(),
    autoStart: false,
    taskSettings: {
      showToggleTaskListBtn: false,
    },
  };

  const store = new ElectronStore<AppStore>({
    defaults,
    migrations: {
      '>1.9.0': (store) => {
        const pomodoroState = store.get('pomodoroState') as PomodoroState &
          PomodoroSettings;

        console.log('>1.9.0 migration running');

        if (!pomodoroState) {
          return;
        }

        store.set('pomodoroSettings', {
          autoRunWork: pomodoroState.autoRunWork,
          autoRunBreak: pomodoroState.autoRunBreak,
          workDurationSeconds: pomodoroState.workDurationSeconds,
          longBreakDurationSeconds: pomodoroState.longBreakDurationSeconds,
          longBreakInterval: pomodoroState.longBreakInterval,
          openFullWindowOnBreak: pomodoroState.openFullWindowOnBreak,
          shortBreakDurationSeconds: pomodoroState.shortBreakDurationSeconds,
        } as PomodoroSettings);

        store.set('pomodoroState', {
          isRunning: pomodoroState.isRunning,
          remainingPercentage: pomodoroState.remainingPercentage,
          remainingSeconds: pomodoroState.remainingSeconds,
          remainingTime: pomodoroState.remainingTime,
          shortBreakCount: pomodoroState.shortBreakCount,
          start: pomodoroState.start,
          state: pomodoroState.state,
        } as PomodoroState);
      },
    },
  });

  if (process.env.CLEAR_STORE_ON_APP_RUN === 'true') {
    store.clear();

    store.set(defaults);
  }

  return store;
};

export const createContext = async (): Promise<AppContext> => {
  if (process.env.CLEAR_DB_ON_RUN === 'true') {
    const dbPath = getDbPath();

    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  }

  const preload = path.join(__dirname, 'preload.js');

  const connection = await setupConnection();

  const taskRepository = new TaskRepository(connection, Tables.Tasks);

  await connection.migrate.latest();

  const taskCrudService = new TaskCrudService(taskRepository);

  const autoLaunch = new AutoLaunch({
    isHidden: true,
    name: app.getName(),
  });

  const store = createStore();

  const settingsService = new SettingsService(autoLaunch, store);

  const pomodoro = new PomodoroService(store, settingsService);

  const menuFactory = new MenuFactory(pomodoro, settingsService);
  const windowFactory = new WindowFactory(preload, menuFactory, store);

  const audioPlayer = new AudioPlayer(audios, windowFactory);

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
    pomodoroService: pomodoro,
    preloadPath: preload,
    windowFactory,
    menuFactory,
    taskCrudService,
    autoLaunch,
    settingsService,
    trelloClient,
    trelloService,
    apiAuthService,
    apiAuthState,
    contextMenuFactory: new ContextMenuFactory(pomodoro, settingsService),
    taskSynchronizer,
    audioPlayer,
    notificationService: new NotificationsService(),
  };
};
