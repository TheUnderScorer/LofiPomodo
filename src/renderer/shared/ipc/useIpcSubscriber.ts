import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useCallback, useEffect } from 'react';
import { atom, RecoilState, useSetRecoilState } from 'recoil';

export interface IpcReceiverHookProps<T> {
  recoilAtom?: RecoilState<T>;
}

export type IpcReceiverCallback<T> = (event: any, payload: T) => any;

const defaultAtom = atom<any>({
  key: 'useIpcReceiverAtom',
  default: null,
});

export const useIpcSubscriber = <T>(
  subject: string,
  callback: IpcReceiverCallback<T>,
  { recoilAtom }: IpcReceiverHookProps<T> = {}
) => {
  const setRecoilValue = useSetRecoilState(recoilAtom ?? defaultAtom);
  const ipc = useIpcRenderer();

  const handler = useCallback(
    (_: unknown, payload: T) => {
      console.log(`Received ipc subscription event ${subject}: `, payload);

      if (recoilAtom) {
        setRecoilValue(payload);
      }

      callback(_, payload);
    },
    [callback, recoilAtom, setRecoilValue, subject]
  );

  useEffect(() => {
    const unsub = ipc.subscribe(subject, handler);

    return () => {
      unsub();
    };
  }, [callback, handler, ipc, subject]);
};
