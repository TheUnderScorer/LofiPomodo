import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useCallback, useState } from 'react';
import { Nullable } from '../../../shared/types';

type InvokeFn<Arg extends object, ReturnValue = any> = (
  arg: Arg
) => Promise<ReturnValue | null>;

interface InvokeMeta<Result = any> {
  error: Nullable<Error>;
  loading: boolean;
  result: Nullable<Result>;
}

export const useIpcInvoke = <Arg extends object = object, ReturnValue = any>(
  name: string
): [invoke: InvokeFn<Arg>, result: InvokeMeta<ReturnValue>] => {
  const ipc = useIpcRenderer();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ReturnValue | null>(null);

  const invoke = useCallback(
    async (args?: Arg) => {
      setLoading(true);

      try {
        const ipcResult = await ipc.invoke(name, args);
        setResult(ipcResult);

        return ipcResult;
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ipc, name]
  );

  return [
    invoke,
    {
      loading,
      result,
      error,
    },
  ];
};
