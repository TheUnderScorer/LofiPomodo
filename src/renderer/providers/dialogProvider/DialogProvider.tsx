import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  HStack,
} from '@chakra-ui/core';
import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { currentDialogPropsAtom, dialogOpenAtom } from './state';

export interface DialogProviderProps {}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [open, setOpen] = useRecoilState(dialogOpenAtom);
  const [dialogProps, setDialogProps] = useRecoilState(currentDialogPropsAtom);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const cancelRef = useRef<HTMLButtonElement>();

  return (
    <>
      <AlertDialog
        isOpen={Boolean(open && dialogProps)}
        leastDestructiveRef={cancelRef as MutableRefObject<HTMLButtonElement>}
        onClose={closeDialog}
      >
        <AlertDialogOverlay>
          {dialogProps && (
            <AlertDialogContent>
              <AlertDialogHeader {...dialogProps.headerProps}>
                {dialogProps.title}
              </AlertDialogHeader>

              <AlertDialogBody>{dialogProps.body}</AlertDialogBody>
              <AlertDialogFooter>
                <HStack spacing={2}>
                  {dialogProps.footer({
                    leastDestructiveRef: cancelRef as MutableRefObject<
                      HTMLButtonElement
                    >,
                    onClose: closeDialog,
                  })}
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialogOverlay>
      </AlertDialog>
      {children}
    </>
  );
};
