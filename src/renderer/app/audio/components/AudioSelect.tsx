import { Button, Center, HStack, SelectProps } from '@chakra-ui/react';
import React from 'react';
import { useIpcQuery } from '../../../shared/ipc/useIpcQuery';
import {
  AudioData,
  AudioOperations,
  PlayAudioPayload,
} from '../../../../shared/types/audio';
import { Text } from '../../../ui/atoms/text/Text';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { OmitUnderscored } from '../../../../shared/types';
import { OptionSeparator } from '../../../ui/atoms/optionSeparator/OptionSeparator';
import { Select } from '../../../ui/molecules/select/Select';
import { Loading } from '../../../ui/atoms/loading/Loading';

export interface AudioSelectProps extends OmitUnderscored<SelectProps> {}

export const AudioSelect = (props: AudioSelectProps) => {
  const { data: audios, isLoading, isFetched } = useIpcQuery<
    never,
    AudioData[]
  >(AudioOperations.GetAudios);

  const { mutateAsync: playAudio } = useIpcMutation<PlayAudioPayload>(
    AudioOperations.PlayAudio
  );

  if (isLoading) {
    return (
      <Center>
        <Loading />
      </Center>
    );
  }

  return (
    <HStack>
      <Select {...props}>
        <option value="">Play nothing</option>
        <OptionSeparator />
        {isFetched &&
          audios!.map((audio) => (
            <option value={audio.name} key={audio.name}>
              {audio.name}
            </option>
          ))}
      </Select>
      {props.value && (
        <Button onClick={() => playAudio({ name: props.value!.toString() })}>
          <Text>Preview</Text>
        </Button>
      )}
    </HStack>
  );
};
