import {
  TrelloList,
  TrelloSettings,
} from '../../../../../../../shared/types/integrations/trello';
import { Controller, useFormContext } from 'react-hook-form';
import React, { FC, useMemo } from 'react';
import { get } from 'lodash';
import { FormControl } from '../../../../../../ui/atoms/formControl/FormControl';
import { minArrayLength } from '../../../../../../form/validators/minArrayLength';
import { Box, Checkbox, CheckboxGroup, Tooltip, VStack } from '@chakra-ui/core';
import { Text } from '../../../../../../ui/atoms/text/Text';

export interface TrelloListsSelectionProps {
  name: string;
  lists?: TrelloList[];
  defaultValue: string[];
}

export const TrelloListsSelection: FC<TrelloListsSelectionProps> = ({
  name,
  lists,
  defaultValue,
}) => {
  const form = useFormContext<TrelloSettings>();
  const error = useMemo(() => get(form.errors, name), [form.errors, name]);

  return (
    <FormControl error={error?.message} w="50%" label="Lists" name={name}>
      <Controller
        defaultValue={defaultValue}
        rules={{
          required: true,
          minLength: 1,
          validate: {
            notEmpty: minArrayLength(1),
          },
        }}
        name={name}
        control={form.control}
        render={(props) => (
          <CheckboxGroup
            value={props.value}
            onChange={(newListIds) => {
              props.onChange(newListIds);
            }}
          >
            <VStack alignItems="flex-start">
              {lists?.map((list) => (
                <Tooltip label={list.name} key={list.id}>
                  <Box>
                    <Checkbox value={list.id}>
                      <Text maxWidth="30vw" isTruncated>
                        {list.name}
                      </Text>
                    </Checkbox>
                  </Box>
                </Tooltip>
              ))}
            </VStack>
          </CheckboxGroup>
        )}
      />
    </FormControl>
  );
};
