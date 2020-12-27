import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useCallback, useEffect } from 'react';
import { atom, RecoilState, useSetRecoilState } from 'recoil';

export interface IpcReceiverHookProps<T> {
  recoilAtom?: RecoilState<T>;
}

const defaultAtom = atom<any>({
  key: 'useIpcReceiverAtom',
  default: null,
});

export const useIpcReceiver = <T>(
  name: string,
  callback: (event: any, ...args: any[]) => any,
  { recoilAtom }: IpcReceiverHookProps<T> = {}
) => {
  const setRecoilValue = useSetRecoilState(recoilAtom ?? defaultAtom);
  const ipc = useIpcRenderer();

  const handler = useCallback(
    (_: unknown, payload: T) => {
      if (recoilAtom) {
        setRecoilValue(payload);
      }

      callback(_, payload);
    },
    [callback, recoilAtom, setRecoilValue]
  );

  useEffect(() => {
    const unsub = ipc.receive(name, handler);

    return () => {
      unsub();
    };
  }, [callback, handler, ipc, name]);
};