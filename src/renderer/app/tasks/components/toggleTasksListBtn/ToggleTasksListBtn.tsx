import React, { useCallback, useMemo, useState } from 'react';
import { OmitUnderscored } from '../../../../../shared/types';
import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import {
  defaultWindowHeight,
  getMinWindowHeight,
} from '../../../../../shared/windows/constants';
import { usePlatform } from '../../../system/hooks/usePlatform';
import { useEvent, useMount } from 'react-use';
import classNames from 'classnames';

export interface ToggleTasksListBtnProps
  extends Omit<OmitUnderscored<IconButtonProps>, 'aria-label' | 'onClick'> {}

export const ToggleTasksListBtn = (props: ToggleTasksListBtnProps) => {
  const { is } = usePlatform();

  const minWindowHeight = useMemo(
    () => getMinWindowHeight(Boolean(is?.windows)),
    [is]
  );

  const [taskListVisible, setTaskListVisible] = useState(
    window.innerWidth !== minWindowHeight
  );

  const resizeWindow = useCallback(() => {
    if (!taskListVisible) {
      window.resizeTo(window.innerWidth, defaultWindowHeight);

      return;
    }

    window.resizeTo(window.innerWidth, minWindowHeight);
  }, [minWindowHeight, taskListVisible]);

  const handleWindowResize = useCallback(() => {
    setTaskListVisible(window.innerHeight !== minWindowHeight);
  }, [minWindowHeight]);

  useEvent('resize', handleWindowResize, window);

  useMount(handleWindowResize);

  if (!is) {
    return null;
  }

  return (
    <Tooltip label="Toggle tasks list">
      <IconButton
        {...props}
        className={classNames(props.className, 'toggle-tasks-list-btn')}
        aria-label="Toggle tasks list"
        onClick={resizeWindow}
      >
        <FaIcon icon={taskListVisible ? faArrowUp : faArrowDown} />
      </IconButton>
    </Tooltip>
  );
};
