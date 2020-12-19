import React, { FC } from 'react';
import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import { routes } from '../../../../../shared/routes/routes';
import { useHistory } from 'react-router-dom';
import { CogIcon } from '../../../../ui/atoms/icons/CogIcon';

export interface PomodoroMenuProps
  extends Partial<Omit<IconButtonProps, 'aria-label' | 'onClick'>> {}

export const PomodoroMenuBtn: FC<PomodoroMenuProps> = (props) => {
  const history = useHistory();

  return (
    <Tooltip label="Open settings">
      <IconButton
        onClick={() => history.push(routes.settings())}
        variant="ghost"
        aria-label="Toggle menu"
        className="settings-btn"
        {...props}
      >
        <CogIcon width="20px" height="20px" />
      </IconButton>
    </Tooltip>
  );
};
