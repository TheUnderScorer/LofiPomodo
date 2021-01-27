import {
  PomodoroSettings,
  PomodoroState,
  PomodoroStateEnum,
} from '../../../../shared/types';
import { nextStateMap, stateDurationMap } from '../maps';

export const getNextState = (
  pomodoroState: PomodoroState,
  pomodoroSettings: PomodoroSettings
) => {
  return nextStateMap[pomodoroState.state](pomodoroState, pomodoroSettings);
};

export const getDurationByState = (
  pomodoro: PomodoroSettings,
  state: PomodoroStateEnum
) => {
  const prop = stateDurationMap[state];

  return pomodoro[prop] as number;
};
