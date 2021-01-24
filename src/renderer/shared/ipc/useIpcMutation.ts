import { QueryKey, useMutation, useQueryClient } from 'react-query';
import { useIpcRenderer } from '../../providers/IpcRendererProvider';
import { useDialog } from '../../providers/dialogProvider/hooks/useDialog';
import { errorDialog } from '../../providers/dialogProvider/factories/errorDialog';

export interface IpcInvokeHookParams<T, Variables> {
  invokeAtMount?: boolean;
  variables?: Variables;
  onComplete?: (value: T | undefined) => any;
  invalidateQueries?: QueryKey[];
}

const defaultVariables = {};

export const useIpcMutation = <Arg = any, ReturnValue = any>(
  name: string,
  {
    variables = defaultVariables as Arg,
    onComplete,
    invalidateQueries,
  }: IpcInvokeHookParams<ReturnValue, Arg> = {}
) => {
  const { showDialog } = useDialog();
  const client = useQueryClient();
  const ipcRenderer = useIpcRenderer();

  return useMutation<ReturnValue, Error, Arg>(
    [name, variables],
    (variables) => ipcRenderer.invoke(name, variables ?? {}),
    {
      onError: (error, variables) => {
        console.error(`Mutation ${name} failed`, {
          error,
          variables,
        });

        showDialog(errorDialog(error));
      },
      onSuccess: async (data, variables) => {
        console.info(`Mutation ${name} completed`, {
          data,
          variables,
        });

        if (invalidateQueries?.length) {
          console.info(
            `Invalidating queries after ${name} mutation:`,
            invalidateQueries
          );
          await Promise.all(
            invalidateQueries.map((query) => client.invalidateQueries(query))
          );
        }

        if (onComplete) {
          onComplete(data);
        }
      },
    }
  );
};
