import { IpcRenderer } from "electron";

export class IpcRendererService {
  constructor(private readonly ipc: IpcRenderer = window.ipcRenderer) {}

  async invoke<Arg extends object = object, ReturnValue = any>(
    name: string,
    arg?: Arg
  ): Promise<ReturnValue> {
    const result = await this.ipc.invoke(name, arg);

    if (result?.error) {
      throw new Error(result.error.message);
    }

    return result;
  }
}
