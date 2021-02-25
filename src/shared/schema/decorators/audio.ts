import audios from '../../../assets/audio/audios.json';
import * as jf from 'joiful';

const audioNames = [...audios.map((audio) => audio.name), ''];

export const audio = () => jf.string().valid(audioNames).optional();
