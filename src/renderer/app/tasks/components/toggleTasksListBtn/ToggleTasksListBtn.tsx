import React, { useCallback, useMemo, useState } from 'react';
import { OmitUnderscored } from '../../../../../shared/types';
import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import {
  defaultWindowHeight,
  getMinWindowHeight,
} from '../../../../../shared/windows/constants';
import { usePlatform } from '../../../system/hooks/usePlatform';
import { useEvent, useMount } from 'react-use';
import classNames from 'classnames';
import { ArrowIcon } from '../../../../ui/atoms/icons';

export interface ToggleTasksListBtnProps
  extends Omit<OmitUnderscored<IconButtonProps>, 'aria-label' | 'onClick'> {
  offset?: number;
}

export const ToggleTasksListBtn = ({
  offset = 70,
  ...props
}: ToggleTasksListBtnProps) => {
  const { is } = usePlatform();

  const minWindowHeight = useMemo(
    () => getMinWindowHeight(Boolean(is?.windows)),
    [is]
  );

  const shouldShowTaskList = useCallback(
    () => window.innerHeight - minWindowHeight! >= offset!,
    [minWindowHeight, offset]
  );

  const [taskListVisible, setTaskListVisible] = useState(shouldShowTaskList());

  const resizeWindow = useCallback(() => {
    if (!taskListVisible) {
      window.resizeTo(window.innerWidth, defaultWindowHeight);

      return;
    }

    window.resizeTo(window.innerWidth, minWindowHeight);
  }, [minWindowHeight, taskListVisible]);

  const handleWindowResize = useCallback(() => {
    setTaskListVisible(shouldShowTaskList());
  }, [shouldShowTaskList]);

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
        <ArrowIcon
          height="30px"
          iconDirection={taskListVisible ? 'up' : 'down'}
        />
      </IconButton>
    </Tooltip>
  );
};
