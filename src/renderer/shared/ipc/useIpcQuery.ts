import { IpcInvokeHookParams } from './useIpcMutation';
import { useQuery } from 'react-query';
import { useIpcRenderer } from '../../providers/IpcRendererProvider';

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
    (ó) => ipc.invoke(name, args?.variables ?? {}),
    {
      onSuccess: (result) => {
        console.info(`Query ${name} completed:`, {
          args,
          result,
        });

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
