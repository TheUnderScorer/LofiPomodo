import {
  AudioData,
  AudioSubscriptionTopics,
} from '../../../../shared/types/audio';
import { WindowFactory } from '../../../shared/windows/factories/WindowFactory';

export class AudioPlayer {
  private readonly audioData = new Map<string, AudioData>();

  constructor(
    audios: AudioData[],
    private readonly windowFactory: WindowFactory
  ) {
    audios.forEach((audio) => {
      this.audioData.set(audio.name, audio);
    });
  }

  async play(name: string) {
    const window = await this.windowFactory.createAudioPlayerWindow();
    const audio = this.audioData.get(name);

    if (!audio) {
      throw new Error(`No audio found with name ${name}`);
    }

    window.webContents.send(AudioSubscriptionTopics.PlayAudio, audio.fileName);
  }

  get audios() {
    return Array.from(this.audioData.values());
  }
}
