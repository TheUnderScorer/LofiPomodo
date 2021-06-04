import React, { FC } from 'react';
import {
  Alert as BaseAlert,
  AlertDescription,
  AlertStatus,
  AlertIcon,
  AlertProps as BaseAlertProps,
} from '@chakra-ui/react';
import { OmitUnderscored } from '../../../../shared/types';

export interface AlertProps
  extends Omit<OmitUnderscored<BaseAlertProps>, 'status' | 'backgroundColor'> {
  type: AlertStatus;
  title?: string;
}

const colorMap: Record<string, string> = {
  error: 'danger',
};

export const Alert: FC<AlertProps> = ({ type, children, ...props }) => {
  return (
    <BaseAlert
      backgroundColor={`brand.${colorMap[type] ?? type}`}
      status={type}
      {...props}
    >
      <AlertIcon />
      <AlertDescription>{children}</AlertDescription>
    </BaseAlert>
  );
};
