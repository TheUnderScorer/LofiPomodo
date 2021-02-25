import React from 'react';
import {
  Button,
  ButtonProps,
  useStyleConfig,
  useStyles,
  useTab,
} from '@chakra-ui/react';

export interface TabProps extends ButtonProps {}

export const Tab = (props: TabProps) => {
  const tabProps = useTab(props);

  const tabStyles = useStyles();
  const buttonStyles = useStyleConfig('Button', { variant: props.variant });

  return (
    <Button
      {...tabProps}
      sx={{
        ...buttonStyles,
        size: tabStyles.size,
      }}
    >
      {props.children}
    </Button>
  );
};
