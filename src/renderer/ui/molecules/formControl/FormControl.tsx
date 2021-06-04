import React, { FC, ReactNode } from 'react';
import {
  Box,
  BoxProps,
  FormControl as BaseFormControl,
  FormControlProps as BaseFormControlProps,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { OmitUnderscored } from '../../../../shared/types';
import { Icon } from '../../atoms/icons/Icon';

export interface FormControlProps
  extends Omit<OmitUnderscored<BaseFormControlProps>, 'helperText'> {
  label?: string;
  helperText?: ReactNode;
  name?: string;
  error?: string;
  helperInTooltip?: boolean;
  contentBoxProps?: BoxProps;
}

export const FormControl: FC<FormControlProps> = ({
  label,
  helperText,
  name,
  error,
  children,
  helperInTooltip,
  contentBoxProps,
  ...rest
}) => {
  return (
    <BaseFormControl isInvalid={Boolean(error)} {...rest}>
      {label && (
        <FormLabel color="brand.textPrimary" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Box
        d={helperInTooltip ? 'flex' : undefined}
        alignItems="center"
        {...contentBoxProps}
      >
        {children}
        {helperInTooltip && helperText && (
          <Tooltip label={helperText as string}>
            <IconButton left={1} variant="link" aria-label="Field helper text">
              <Icon name="Info" width="23px" height="23px" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {helperText && !helperInTooltip && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {error && <FormErrorMessage width="100%">{error}</FormErrorMessage>}
    </BaseFormControl>
  );
};
