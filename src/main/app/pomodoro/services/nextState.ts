import { Pomodoro } from '../../../../shared/types';
import { nextStateMap, stateDurationMap } from '../maps';

export const getNextState = (pomodoro: Pomodoro) => {
  return nextStateMap[pomodoro.state](pomodoro);
};

export const getDurationByState = (
  pomodoro: Pomodoro,
  state = pomodoro.state
) => {
  const prop = stateDurationMap[state];

  return pomodoro[prop] as number;
};
