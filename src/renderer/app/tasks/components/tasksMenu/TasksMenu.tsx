import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useGroupedTasksCount } from '../../hooks/useGroupedTasksCount';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';
import { TaskEvents } from '../../../../../shared/types/tasks';
import { useInlineConfirm } from '../../../../shared/hooks/useInlineConfirm';
import { useTasksList } from '../../hooks/useTasksList';

export interface TasksMenuProps {
  menuButtonProps?: MenuButtonProps;
  loading?: boolean;
}

export const TasksMenu: FC<TasksMenuProps> = ({ menuButtonProps, loading }) => {
  const { count, getCount } = useGroupedTasksCount();
  const { getTasks } = useTasksList();

  const [
    removeDeletedCompletedTasksMutation,
    { loading: removingCompletedTasks },
  ] = useIpcInvoke(TaskEvents.DeleteCompletedTasks);
  const handleDeleteCompletedTasks = useCallback(async () => {
    await removeDeletedCompletedTasksMutation();

    await Promise.all([getCount(), getTasks()]);
  }, [getCount, getTasks, removeDeletedCompletedTasksMutation]);
  const inlineDeleteCompletedTasks = useInlineConfirm({
    confirmText: 'Delete?',
    actionText: 'Delete all completed tasks',
    onClick: handleDeleteCompletedTasks,
  });

  return (
    <Menu isLazy closeOnSelect={false} placement="left-end">
      <MenuButton {...menuButtonProps}>
        {loading ? (
          <Spinner color="brand.primary" />
        ) : (
          <FaIcon icon={faEllipsisH} />
        )}
      </MenuButton>
      <MenuList>
        <MenuItem
          color="brand.danger"
          isDisabled={!count.Completed || removingCompletedTasks}
          onClick={inlineDeleteCompletedTasks.handleClick}
        >
          {removingCompletedTasks
            ? 'Deleting...'
            : inlineDeleteCompletedTasks.text}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
