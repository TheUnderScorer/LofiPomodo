import {
  Box,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/core';
import React, { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { CreateTaskInput, Task } from '../../../../shared/types/tasks';
import { CommonField } from '../../../ui/molecules/commonField/CommonField';
import { CommonTextarea } from '../../../ui/molecules/commonTextarea/CommonTextarea';
import { FormControl } from '../../../ui/atoms/formControl/FormControl';
import { useCreateTask } from '../hooks/useCreateTask';

export interface TaskFormProps {
  onSubmit?: (task: Task) => any;
  Wrapper?: any;
  Footer?: any;
  wrapperProps?: any;
  footerProps?: any;
}

export const TaskForm: FC<TaskFormProps> = ({
  onSubmit,
  Wrapper = Box,
  Footer = Box,
  wrapperProps,
  footerProps,
}) => {
  const { register, handleSubmit, errors, reset } = useForm<CreateTaskInput>({
    mode: 'all',
  });

  const handleCreate = useCallback(
    (task: Task) => {
      if (onSubmit) {
        onSubmit(task);
      }

      reset();
    },
    [onSubmit, reset]
  );

  const { createTask } = useCreateTask({
    onCreate: handleCreate,
  });

  return (
    <form onSubmit={handleSubmit(createTask)}>
      <Wrapper {...wrapperProps}>
        <Stack spacing={6}>
          <CommonField
            inputProps={{
              placeholder: 'Enter title...',
            }}
            error={errors.title?.message}
            ref={register({
              required: 'Title is required',
            })}
            name="title"
          />
          <CommonTextarea
            textAreaProps={{
              resize: 'none',
              placeholder: 'Enter description...',
            }}
            name="description"
            ref={register()}
          />
          <FormControl d="flex" alignItems="center" label="Estimated pomodoros">
            <NumberInput width="80px" max={30} min={0}>
              <NumberInputField
                name="estimatedPomodoroDuration"
                ref={register() as any}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>
      </Wrapper>
      <Footer border="0" d="flex" justifyContent="flex-end" {...footerProps}>
        <Button type="submit" bg="brand.primary" color="brand.textPrimary">
          Save
        </Button>
      </Footer>
    </form>
  );
};
