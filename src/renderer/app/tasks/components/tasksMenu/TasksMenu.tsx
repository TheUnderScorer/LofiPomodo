import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Spinner,
  MenuIcon,
  MenuDivider,
  Portal,
} from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import {
  faEllipsisH,
  faSync,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useGroupedTasksCount } from '../../hooks/useGroupedTasksCount';
import { useIpcMutation } from '../../../../shared/ipc/useIpcMutation';
import { TaskOperations } from '../../../../../shared/types/tasks';
import { useInlineConfirm } from '../../../../shared/hooks/useInlineConfirm';
import { useTasksSync } from '../../hooks/useTasksSync';
import { Text } from '../../../../ui/atoms/text/Text';
import classNames from 'classnames';

export interface TasksMenuProps {
  menuButtonProps?: MenuButtonProps;
  loading?: boolean;
}

export const TasksMenu: FC<TasksMenuProps> = ({ menuButtonProps, loading }) => {
  const { count } = useGroupedTasksCount();

  const removeDeletedCompletedTasksMutation = useIpcMutation<void>(
    TaskOperations.DeleteCompletedTasks,
    {
      invalidateQueries: [TaskOperations.CountByState, TaskOperations.GetTasks],
    }
  );

  const handleDeleteCompletedTasks = useCallback(async () => {
    await removeDeletedCompletedTasksMutation.mutateAsync();
  }, [removeDeletedCompletedTasksMutation]);

  const inlineDeleteCompletedTasks = useInlineConfirm({
    confirmText: 'Delete?',
    actionText: 'Delete completed tasks',
    onClick: handleDeleteCompletedTasks,
  });

  const { isSyncing, sync } = useTasksSync();

  return (
    <Menu isLazy closeOnSelect={false} placement="left-end">
      <MenuButton width="30px" {...menuButtonProps}>
        {loading ? (
          <Spinner color="brand.primary" />
        ) : (
          <FaIcon icon={faEllipsisH} />
        )}
      </MenuButton>
      <Portal>
        <MenuList width="40vh" minWidth="300px">
          <MenuItem
            leftIcon={<FaIcon icon={faSync} />}
            isdisabled={isSyncing}
            onClick={() => sync()}
          >
            <MenuIcon mr={2}>
              <FaIcon
                className={classNames({
                  'animation-rotate': isSyncing,
                })}
                icon={faSync}
              />
            </MenuIcon>
            <Text>{isSyncing ? 'Syncing tasks...' : 'Sync tasks'}</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            color="brand.danger"
            isDisabled={
              !count?.Completed || removeDeletedCompletedTasksMutation.isLoading
            }
            onClick={inlineDeleteCompletedTasks.handleClick}
          >
            <MenuIcon mr={2}>
              <FaIcon color="danger" icon={faTrash} />
            </MenuIcon>
            {removeDeletedCompletedTasksMutation.isLoading
              ? 'Deleting...'
              : inlineDeleteCompletedTasks.text}
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
