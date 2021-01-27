import { app, BrowserWindow } from 'electron';
import {
  AudioData,
  AudioSubscriptionTopics,
} from '../../../../shared/types/audio';

export class AudioPlayer {
  private readonly audioData = new Map<string, AudioData>();

  constructor(
    audios: AudioData[],
    private readonly playerWindow: BrowserWindow
  ) {
    audios.forEach((audio) => {
      this.audioData.set(audio.name, audio);
    });

    app.on('before-quit', () => {
      this.playerWindow.close();
    });
  }

  async play(name: string) {
    const audio = this.audioData.get(name);

    if (!audio) {
      throw new Error(`No audio found with name ${name}`);
    }

    this.playerWindow.webContents.send(
      AudioSubscriptionTopics.PlayAudio,
      audio.fileName
    );
  }

  get audios() {
    return Array.from(this.audioData.values());
  }
}
