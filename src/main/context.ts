import { IpcMainService } from './shared/ipc/IpcMainService';
import ElectronStore from 'electron-store';

export interface AppContext {
  ipcService: IpcMainService;
  store: ElectronStore;
}
