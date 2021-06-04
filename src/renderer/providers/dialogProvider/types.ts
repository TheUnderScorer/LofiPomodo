import { ModalHeaderProps } from '@chakra-ui/react';
import { ReactNode, Ref } from 'react';

export interface DialogFooterBag {
  onClose: () => any;
  leastDestructiveRef: Ref<HTMLButtonElement>;
}

export interface DialogMethods {
  showDialog: (props: DialogProps) => void;
  closeDialog: () => void;
  isOpen: boolean;
}

export interface DialogProps {
  headerProps?: ModalHeaderProps;
  title: ReactNode;
  body: ReactNode;
  footer: (bag: DialogFooterBag) => ReactNode;
}
