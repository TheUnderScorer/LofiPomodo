import { DialogProps } from '../types';
import { AppError } from '../../../../shared/errors/AppError';
import React from 'react';
import { Button } from '@chakra-ui/core';

export const errorDialog = <T extends Error>(error: T): DialogProps => ({
  title: error instanceof AppError ? error.title : 'Error occured!',
  body: error.message,
  footer: (bag) => (
    <Button ref={bag.leastDestructiveRef} onClick={bag.onClose}>
      Close
    </Button>
  ),
});
