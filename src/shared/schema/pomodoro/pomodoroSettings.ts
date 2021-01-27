import Yup from '../yup';
import { PomodoroSettings } from '../../types';
import { YupObjectSchema } from '../types';
import { requiredMessage } from '../messages';
import audios from '../../../assets/audio/audios.json';

const audioNames = [...audios.map((audio) => audio.name), ''];

export const pomodoroSettingsSchemaShape = {
  shortBreakDurationSeconds: Yup.number().duration(),
  openFullWindowOnBreak: Yup.boolean().required(),
  longBreakInterval: Yup.number()
    .transformInt()
    .min(1, 'Value must be larger than 0')
    .max(70, 'Value must be smaller than 70')
    .required(requiredMessage),
  longBreakDurationSeconds: Yup.number().duration(),
  workDurationSeconds: Yup.number().duration(),
  autoRunBreak: Yup.boolean().required(),
  autoRunWork: Yup.boolean().required(),
  workSound: Yup.string().oneOf(audioNames),
  longBreakSound: Yup.string().oneOf(audioNames),
  breakSound: Yup.string().oneOf(audioNames),
} as YupObjectSchema<PomodoroSettings & any>;

export const pomodoroSettingsSchema = Yup.object().shape(
  pomodoroSettingsSchemaShape
);
