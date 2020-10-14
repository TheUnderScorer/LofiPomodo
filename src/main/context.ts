import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';
import { AppStore } from '../shared/types/store';
import { PomodoroService } from './app/pomodoro/services/PomodoroService';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService;
}

export const createContext = (): AppContext => {
  const store = new ElectronStore<AppStore>();
  const pomodoro = new PomodoroService(store);

  return {
    ipcService: new IpcMainService(),
    store,
    pomodoro,
  };
};
