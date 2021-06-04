import {
  PomodoroSettings,
  PomodoroState,
  PomodoroStates,
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
  state: PomodoroStates
) => {
  const prop = stateDurationMap[state];

  return pomodoro[prop] as number;
};
