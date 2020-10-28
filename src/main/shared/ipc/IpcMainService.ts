import { ipcMain, IpcMain, IpcMainInvokeEvent } from 'electron';

/**
 * Definition of callback that will be triggered on message from renderer process
 * */
export type IpcServiceCallback<
  Args extends object = object,
  ReturnValue = any
> = (
  event: IpcMainInvokeEvent,
  args: Args
) => ReturnValue | Promise<ReturnValue>;

export class IpcMainService {
  constructor(private readonly ipc: IpcMain = ipcMain) {}

  registerAsMap(map: Record<string, IpcServiceCallback<any, any>>) {
    const entries = Object.entries(map);

    const unregisterCallbacks = entries.map(([eventName, handler]) => {
      return this.handle(eventName, handler);
    });

    return () => {
      unregisterCallbacks.forEach((callback) => {
        callback();
      });
    };
  }

  handle<Args extends object = object, ReturnValue = any>(
    name: string,
    callback: IpcServiceCallback<Args, ReturnValue>
  ) {
    const handler = async (event: IpcMainInvokeEvent, args: Args) => {
      try {
        return await callback(event, args);
      } catch (e) {
        return {
          error: e,
        };
      }
    };

    this.ipc.handle(name, handler);

    return () => {
      this.ipc.removeHandler(name);
    };
  }
}
