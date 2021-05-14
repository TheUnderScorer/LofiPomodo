import React, { FC } from 'react';
import {
  IconButton,
  IconButtonProps,
  Tooltip,
  useTheme,
} from '@chakra-ui/react';
import { routes } from '../../../../../shared/routes/routes';
import { useHistory } from 'react-router-dom';
import { Icon } from '../../../../ui/atoms/icons/Icon';

export interface PomodoroMenuProps
  extends Partial<Omit<IconButtonProps, 'aria-label' | 'onClick'>> {}

export const PomodoroMenuBtn: FC<PomodoroMenuProps> = (props) => {
  const history = useHistory();
  const theme = useTheme();

  return (
    <Tooltip label="Open settings">
      <IconButton
        onClick={() => history.push(routes.settings())}
        variant="ghost"
        aria-label="Toggle menu"
        className="settings-btn"
        {...props}
      >
        <Icon
          sx={{
            '& path': {
              fill: theme.colors.brand.iconPrimary,
            },
          }}
          fill="white"
          name="Squares"
          width="20px"
          height="20px"
        />
      </IconButton>
    </Tooltip>
  );
};
