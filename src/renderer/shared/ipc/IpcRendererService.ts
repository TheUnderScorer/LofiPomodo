import { IpcRenderer } from 'electron';

export class IpcRendererService {
  constructor(private readonly ipc: IpcRenderer = window.ipcRenderer) {}

  async invoke<Arg extends object = object, ReturnValue = any>(
    name: string,
    arg?: Arg
  ): Promise<ReturnValue> {
    console.log(`Invoking ${name} with args:`, arg);

    const result = await this.ipc.invoke(name, arg);

    if (result?.error) {
      throw new Error(result.error.message);
    }

    return result;
  }

  subscribe(name: string, listener: (event: object, ...args: any[]) => void) {
    this.ipc.on(name, listener);

    return () => {
      this.ipc.off(name, listener);
    };
  }
}
