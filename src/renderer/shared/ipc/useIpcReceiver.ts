import { useIpcRenderer } from '../../providers/IpcRendererProvider';

export const useIpcReceiver = (callback: (...args: any[]) => any) => {
  const ipc = useIpcRenderer();
};
