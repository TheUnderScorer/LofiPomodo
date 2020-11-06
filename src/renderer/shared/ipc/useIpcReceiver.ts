import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useEffect } from 'react';

export const useIpcReceiver = (
  name: string,
  callback: (event: any, ...args: any[]) => any
) => {
  const ipc = useIpcRenderer();

  useEffect(() => {
    const unsub = ipc.receive(name, callback);

    return () => {
      unsub();
    };
  }, [callback, ipc, name]);
};
