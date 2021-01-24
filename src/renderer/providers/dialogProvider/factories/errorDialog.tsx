import { DialogProps } from '../types';
import { AppError } from '../../../../shared/errors/AppError';
import React from 'react';
import { Button } from '@chakra-ui/core';
import { Text } from '../../../ui/atoms/text/Text';

export const errorDialog = <T extends Error>(error: T): DialogProps => ({
  title: (
    <Text color="brand.danger">
      {error instanceof AppError ? error.title : 'Error occured!'}
    </Text>
  ),
  body: <Text>{error.message}</Text>,
  footer: (bag) => (
    <Button ref={bag.leastDestructiveRef} onClick={bag.onClose}>
      Close
    </Button>
  ),
});
