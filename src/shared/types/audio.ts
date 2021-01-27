export interface AudioData {
  name: string;
  fileName: string;
}

export enum AudioSubscriptionTopics {
  PlayAudio = 'PlayAudio',
  StopAudio = 'StopAudio',
}

export enum AudioOperations {
  GetAudios = 'GetAudios',
  PlayAudio = 'PlayAudio',
}

export interface PlayAudioPayload {
  name: string;
}
