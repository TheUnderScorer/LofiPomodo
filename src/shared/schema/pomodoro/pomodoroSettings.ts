import Yup from '../yup';
import { PomodoroSettings } from '../../types';
import { YupObjectSchema } from '../types';

export const pomodoroSettingsSchemaShape = {
  shortBreakDurationSeconds: Yup.number().duration(),
  openFullWindowOnBreak: Yup.boolean().required(),
  longBreakInterval: Yup.number()
    .min(1, 'Value must be larger than 0')
    .max(70, 'Value must be smaller than 70')
    .required('Provide long break interval.'),
  longBreakDurationSeconds: Yup.number().duration(),
  workDurationSeconds: Yup.number().duration(),
  autoRunBreak: Yup.boolean().required(),
  autoRunWork: Yup.boolean().required(),
} as YupObjectSchema<PomodoroSettings>;

export const pomodoroSettingsSchema = Yup.object().shape(
  pomodoroSettingsSchemaShape
);
