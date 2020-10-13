import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';
import { AppStore } from '../shared/types/store';
import { PomodoroService } from './app/pomodoro/services/PomodoroService';
import { CanSubscribe } from '../shared/types';
import { reactive } from '../shared/reactive';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore<AppStore>;
  pomodoro: PomodoroService & CanSubscribe<PomodoroService>;
}

export const createContext = (): AppContext => {
  const store = new ElectronStore<AppStore>();
  const pomodoro = reactive(new PomodoroService(store));

  return {
    ipcService: new IpcMainService(),
    store,
    pomodoro,
  };
};
