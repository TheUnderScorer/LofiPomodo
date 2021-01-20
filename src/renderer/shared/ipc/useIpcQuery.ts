import { InvokeMeta, IpcInvokeHookParams, useIpcInvoke } from './useIpcInvoke';
import { useCallback } from 'react';

export interface IpcQueryResult<T, Variables> extends InvokeMeta<T> {
  refetch: (variables?: Variables) => Promise<void>;
}

export type IpcQueryArgs<ReturnValue = any, Arg = any> = Omit<
  IpcInvokeHookParams<ReturnValue, Arg>,
  'invokeAtMount'
>;

export const useIpcQuery = <
  Arg extends Record<string, any> = Record<string, any>,
  ReturnValue = any
>(
  name: string,
  args?: IpcQueryArgs<ReturnValue, Arg>
): IpcQueryResult<ReturnValue, Arg> => {
  const [invoke, result] = useIpcInvoke(name, {
    ...args,
    invokeAtMount: true,
  });

  const refetch = useCallback(
    async (variables?: Arg) => {
      await invoke(variables);
    },
    [invoke]
  );

  return {
    ...result,
    refetch,
  };
};
