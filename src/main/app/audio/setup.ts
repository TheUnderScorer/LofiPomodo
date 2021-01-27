import { AppContext } from '../../context';
import { AudioOperations, PlayAudioPayload } from '../../../shared/types/audio';
import { setupPomodoroSounds } from './services/pomodoroSounds';

export const setupAudio = (context: AppContext) => {
  setupPomodoroSounds(context);

  context.ipcService.registerAsMap({
    [AudioOperations.PlayAudio]: (_: unknown, { name }: PlayAudioPayload) => {
      return context.audioPlayer.play(name);
    },
    [AudioOperations.GetAudios]: () => {
      return context.audioPlayer.audios;
    },
  });
};
