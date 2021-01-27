import { useCallback, useRef } from 'react';
import { useIpcSubscriber } from '../../../shared/ipc/useIpcSubscriber';
import { AudioSubscriptionTopics } from '../../../../shared/types/audio';
import { useIpcMutation } from '../../../shared/ipc/useIpcMutation';
import { AppSystemOperations } from '../../../../shared/types/system';
import { wait } from '../../../../shared/utils/timeout';

export const AudioPlayerView = () => {
  const audioRef = useRef<HTMLAudioElement | null>();

  const closeWindowMutation = useIpcMutation<void>(
    AppSystemOperations.CloseWindow
  );

  const handlePlay = useCallback(
    async (_: unknown, path: string) => {
      const lazyAudio = require(`../../../../assets/audio/${path}`);

      audioRef.current = new Audio(lazyAudio.default);
      audioRef.current!.volume = 0.2;

      /**
       * Delay to avoid "fade" effect
       *
       * @platform Windows
       * */
      await wait(1000);

      audioRef.current!.addEventListener('ended', async () => {
        await closeWindowMutation.mutateAsync();
      });

      try {
        await audioRef.current!.play();

        console.log('Audio played');
      } catch (e) {
        console.error('Failed to play audio', e);
      }
    },
    [closeWindowMutation]
  );

  useIpcSubscriber(AudioSubscriptionTopics.PlayAudio, handlePlay);

  return null;
};
