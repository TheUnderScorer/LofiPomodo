import { IpcInvokeHookParams } from './useIpcMutation';
import { useQuery } from 'react-query';
import { useIpcRenderer } from '../../providers/IpcRendererProvider';

const logQueries = false;

export type IpcQueryArgs<ReturnValue = any, Arg = any> = Omit<
  IpcInvokeHookParams<ReturnValue, Arg>,
  'invokeAtMount'
>;

export const useIpcQuery = <Arg = any, ReturnValue = any>(
  name: string,
  args?: IpcQueryArgs<ReturnValue, Arg>
) => {
  const ipc = useIpcRenderer();

  return useQuery<ReturnValue>(
    args?.variables ? [name, args?.variables] : name,
    () => ipc.invoke(name, args?.variables ?? {}),
    {
      onSuccess: (result) => {
        if (logQueries) {
          console.info(`Query ${name} completed:`, {
            args,
            result,
          });
        }

        if (args?.onComplete) {
          args.onComplete(result);
        }
      },
      onError: (error) => {
        console.error(`Query ${name} failed:`, {
          error,
          args,
        });
      },
    }
  );
};
