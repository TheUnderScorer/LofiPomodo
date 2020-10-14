import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';
import { AppStore } from '../shared/types/store';
import { PomodoroService } from './app/pomodoro/services/PomodoroService';
import path from 'path';
import { WindowFactory } from './shared/windows/factories/WindowFactory';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService;
  preloadPath: string;
  windowFactory: WindowFactory;
}

export const createContext = (): AppContext => {
  const preload = path.join(__dirname, 'preload.js');
  const store = new ElectronStore<AppStore>();
  const pomodoro = new PomodoroService(store);
  const windowFactory = new WindowFactory(preload);

  return {
    ipcService: new IpcMainService(),
    store,
    pomodoro,
    preloadPath: preload,
    windowFactory,
  };
};
