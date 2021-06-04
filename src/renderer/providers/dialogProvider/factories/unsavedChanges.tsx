import { Text } from '../../../ui/atoms/text/Text';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { DialogProps } from '../types';

export const unsavedChangesDialog = (close: () => any): DialogProps => ({
  title: <Text>Close window</Text>,
  body: (
    <Text>
      Are you sure you want to close window? All unsaved changes will be lost!
    </Text>
  ),
  footer: (bag) => (
    <>
      <Button onClick={bag.onClose} ref={bag.leastDestructiveRef}>
        <Text>Cancel</Text>
      </Button>
      <Button backgroundColor="brand.danger" onClick={() => close()}>
        <Text>Close</Text>
      </Button>
    </>
  ),
});
