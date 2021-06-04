import { IconButton, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl } from '../../../../ui/molecules/formControl/FormControl';
import { CreateTaskInput } from '../../../../../shared/types/tasks';
import { FaIcon } from '../../../../ui/atoms/faIcon/FaIcon';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCreateTask } from '../../hooks/useCreateTask';
import { Input } from '../../../../ui/atoms/input/Input';

export interface AddTaskInputProps {}

export const AddTaskInput: FC<AddTaskInputProps> = () => {
  const { register, errors, handleSubmit, reset } = useForm<CreateTaskInput>();

  const handleCreate = useCallback(() => {
    reset();
  }, [reset]);

  const { createTask } = useCreateTask({
    onCreate: handleCreate,
  });

  return (
    <form onSubmit={handleSubmit(createTask)}>
      <FormControl error={errors.title?.message}>
        <InputGroup d="flex">
          <Input
            id="task_title"
            ref={register({
              required: 'Enter task title',
            })}
            placeholder="Add task..."
            name="title"
            py={6}
          />
          <InputRightElement top={1} right={1}>
            <IconButton
              variant="nes-outlined"
              id="create_task"
              type="submit"
              size="sm"
              aria-label="Add task"
            >
              <FaIcon icon={faPlus} />
            </IconButton>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </form>
  );
};
