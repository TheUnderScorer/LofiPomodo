import React, { FC } from 'react';
import { Text } from '../../atoms/text/Text';
import { Button, ButtonProps } from '@chakra-ui/react';

export interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
  id: string;
  text?: string;
  didSubmit?: boolean;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  isLoading,
  id,
  children,
  didSubmit,
  ...props
}) => {
  return (
    <Button
      transition="all .3s"
      id={id}
      type={didSubmit ? 'button' : 'submit'}
      minWidth="150px"
      width="auto"
      isLoading={isLoading}
      backgroundColor={didSubmit ? 'brand.success' : 'brand.primary.300'}
      {...props}
    >
      <Text>{didSubmit ? 'Saved!' : children ?? 'Save'}</Text>
    </Button>
  );
};
