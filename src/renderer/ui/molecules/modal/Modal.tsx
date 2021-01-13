import React, { FC, ReactNode } from 'react';
import {
  Button,
  Center,
  Modal as BaseModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as BaseModalProps,
  Spinner,
} from '@chakra-ui/core';
import { Text } from '../../atoms/text/Text';
import { useModalState } from '../../../providers/modalProvider/hooks/useModalState';

export interface ModalProps extends Omit<BaseModalProps, 'isOpen' | 'onClose'> {
  id: string;
  defaultOpen?: boolean;
  title?: ReactNode;
  showOverlay?: boolean;
  footer?: ReactNode;
  loading?: boolean;
}

export const Modal: FC<ModalProps> = ({
  id,
  children,
  defaultOpen = false,
  title,
  showOverlay,
  footer,
  loading,
  ...props
}) => {
  const state = useModalState({ id: id, defaultOpen: defaultOpen });

  return (
    <BaseModal isOpen={state.isOpen()} onClose={state.hide} {...props}>
      {showOverlay && <ModalOverlay />}
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton color="brand.iconPrimary" />
        <ModalBody>
          {loading && (
            <Center>
              <Spinner color="brand.primary" />
            </Center>
          )}
          {!loading && <>{children}</>}
        </ModalBody>
        <ModalFooter>
          <Button onClick={state.hide}>
            <Text>Close</Text>
          </Button>
          {footer}
        </ModalFooter>
      </ModalContent>
    </BaseModal>
  );
};
