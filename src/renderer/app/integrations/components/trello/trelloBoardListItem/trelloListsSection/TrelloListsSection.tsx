import {
  TrelloList,
  TrelloSettings,
} from '../../../../../../../shared/types/integrations/trello';
import { useFormContext } from 'react-hook-form';
import React, { FC } from 'react';
import { minArrayLength } from '../../../../../../form/validators/minArrayLength';
import { CheckboxGroup, HStack, Tooltip, VStack } from '@chakra-ui/react';
import { Text } from '../../../../../../ui/atoms/text/Text';
import { FormController } from '../../../../../../ui/molecules/formController/FormController';
import { PixelCheckbox } from '../../../../../../ui/atoms/pixelCheckbox/PixelCheckbox';

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

  return (
    <FormController
      form={form}
      name={name}
      w="50%"
      label="Lists"
      defaultValue={defaultValue}
      rules={{
        required: true,
        minLength: 1,
        validate: {
          notEmpty: minArrayLength(1),
        },
      }}
    >
      {(props) => (
        <CheckboxGroup
          value={props.value}
          onChange={(newListIds) => {
            props.onChange(newListIds);
          }}
        >
          <VStack alignItems="flex-start">
            {lists?.map((list) => (
              <Tooltip label={list.name} key={list.id}>
                <HStack>
                  <PixelCheckbox
                    id={`${list.name}-${list.id}`}
                    className="trello-list-checkbox"
                    border="none !important"
                    value={list.id}
                  />
                  <label htmlFor={`${list.name}-${list.id}`}>
                    <Text maxWidth="30vw" isTruncated>
                      {list.name}
                    </Text>
                  </label>
                </HStack>
              </Tooltip>
            ))}
          </VStack>
        </CheckboxGroup>
      )}
    </FormController>
  );
};
