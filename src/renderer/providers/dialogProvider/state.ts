import { atom } from 'recoil';
import { DialogProps } from './types';

export const dialogOpenAtom = atom({
  key: 'dialogOpen',
  default: false,
});

export const currentDialogPropsAtom = atom<DialogProps | undefined>({
  default: undefined,
  key: 'currentDialogProps',
});
