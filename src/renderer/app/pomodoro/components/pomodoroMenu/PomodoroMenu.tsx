import React, { FC } from 'react';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { IconButton, IconButtonProps, Stack } from '@chakra-ui/core';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { routes } from '../../../../../shared/routes/routes';
import { useHistory } from 'react-router-dom';

export interface PomodoroMenuProps
  extends Omit<IconButtonProps, 'aria-label' | 'onClick'> {}

export const PomodoroMenu: FC<PomodoroMenuProps> = (props) => {
  const history = useHistory();

  return (
    <Stack direction="row">
      <IconButton
        onClick={() => history.push(routes.settings())}
        variant="ghost"
        aria-label="Toggle menu"
        {...props}
      >
        <FaIcon icon={faEllipsisV} />
      </IconButton>
    </Stack>
  );
};
