import { useMemo } from 'react';
import { DialogMethods } from '../types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentDialogPropsAtom, dialogOpenAtom } from '../state';

export const useDialog = () => {
  const [open, setOpen] = useRecoilState(dialogOpenAtom);
  const setDialogProps = useSetRecoilState(currentDialogPropsAtom);

  return useMemo<DialogMethods>(
    () => ({
      closeDialog: () => setOpen(false),
      showDialog: (props) => {
        setDialogProps(props);
        setOpen(true);
      },
      isOpen: open,
    }),
    [open, setDialogProps, setOpen]
  );
};
