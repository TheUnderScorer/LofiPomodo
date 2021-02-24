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
import { FaIcon } from '../../atoms/faIcon/FaIcon';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { OmitUnderscored } from '../../../../shared/types';

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
            <IconButton variant="link" aria-label="Field helper text">
              <FaIcon icon={faInfo} />
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
