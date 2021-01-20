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
import { useIpcMutation } from '../../../../shared/ipc/useIpcMutation';
import { TaskEvents } from '../../../../../shared/types/tasks';
import { useInlineConfirm } from '../../../../shared/hooks/useInlineConfirm';

export interface TasksMenuProps {
  menuButtonProps?: MenuButtonProps;
  loading?: boolean;
}

export const TasksMenu: FC<TasksMenuProps> = ({ menuButtonProps, loading }) => {
  const { count } = useGroupedTasksCount();

  const removeDeletedCompletedTasksMutation = useIpcMutation<void>(
    TaskEvents.DeleteCompletedTasks,
    {
      invalidateQueries: [TaskEvents.CountByState, TaskEvents.GetTasks],
    }
  );

  const handleDeleteCompletedTasks = useCallback(async () => {
    await removeDeletedCompletedTasksMutation.mutateAsync();
  }, [removeDeletedCompletedTasksMutation]);

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
          isDisabled={
            !count?.Completed || removeDeletedCompletedTasksMutation.isLoading
          }
          onClick={inlineDeleteCompletedTasks.handleClick}
        >
          {removeDeletedCompletedTasksMutation.isLoading
            ? 'Deleting...'
            : inlineDeleteCompletedTasks.text}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
