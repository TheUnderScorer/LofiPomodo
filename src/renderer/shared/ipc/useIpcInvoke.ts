import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from '../../../shared/types';
import { atom, RecoilState, useRecoilState } from 'recoil';
import { useFirstMountState, useMount, usePrevious } from 'react-use';
import { compact } from '../../utils/compact';
import { objToKey } from '../../utils/objToKey';

type InvokeFn<Arg extends object, ReturnValue = any> = (
  arg?: Arg
) => Promise<ReturnValue | null>;

interface InvokeMeta<Result = any> {
  error: Nullable<Error>;
  loading: boolean;
  result: Nullable<Result>;
  didFetch: boolean;
}

export interface IpcInvokeHookParams<T, Variables> {
  recoilAtom?: RecoilState<T>;
  invokeAtMount?: boolean;
  variables?: Variables;
}

const defaultAtom = atom<any>({
  key: 'useIpcInvokeAtom',
  default: null,
});

const mounted = new Map<string, boolean>();

const defaultVariables = {};

export const useIpcInvoke = <
  Arg extends Record<string, any> = Record<string, any>,
  ReturnValue = any
>(
  name: string,
  {
    recoilAtom,
    invokeAtMount = false,
    variables = defaultVariables as Arg,
  }: IpcInvokeHookParams<ReturnValue, Arg> = {}
): [invoke: InvokeFn<Arg>, result: InvokeMeta<ReturnValue>] => {
  const didFirstMount = useFirstMountState();
  const variablesDep = variables && objToKey(variables);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const watchVariables = useMemo(() => compact(variables), [variablesDep]);
  const prevVariables = usePrevious(variablesDep);

  const ipc = useIpcRenderer();

  const [recoilValue, setRecoil] = useRecoilState<ReturnValue>(
    recoilAtom ?? defaultAtom
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ReturnValue | null>(null);
  const [didFetch, setDidFetch] = useState(false);

  const invoke = useCallback(
    async (args?: Arg) => {
      const invokeArgs = {
        ...(args ?? {}),
        ...(watchVariables ?? {}),
      };

      console.log('Invocation:', {
        name,
        args: invokeArgs,
      });

      setDidFetch(true);

      setLoading(true);

      try {
        const ipcResult = await ipc.invoke(name, invokeArgs);
        setResult(ipcResult);

        if (recoilAtom) {
          setRecoil(ipcResult);
        }

        return ipcResult;
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }

      return null;
    },
    [ipc, name, recoilAtom, setRecoil, watchVariables]
  );

  useMount(() => {
    if (invokeAtMount && !mounted.get(name)) {
      mounted.set(name, true);
      invoke();
    }
  });

  useEffect(() => {
    if (prevVariables && variablesDep !== prevVariables && didFirstMount) {
      invoke();
    }
  }, [variablesDep, invoke, didFirstMount, prevVariables]);

  return [
    invoke,
    {
      loading,
      result: recoilAtom ? recoilValue : result,
      error,
      didFetch,
    },
  ];
};
