import { getDurationByState, getNextState } from './nextState';
import { Pomodoro, PomodoroStates } from '../../../../shared/types';
import { getInitialPomodoro } from '../data';

describe('Next state', () => {
  it.each<[PomodoroStates, keyof Pomodoro]>([
    [PomodoroStates.Break, 'shortBreakDurationSeconds'],
    [PomodoroStates.LongBreak, 'longBreakDurationSeconds'],
    [PomodoroStates.Work, 'workDurationSeconds'],
  ])('should return correct duration by state', (state, prop) => {
    const pomodoro: Pomodoro = {
      ...getInitialPomodoro(),
      state,
    };

    const duration = getDurationByState(pomodoro, state);
    expect(duration).toEqual(pomodoro[prop]);
  });

  it.each<[PomodoroStates, PomodoroStates, number | undefined]>([
    [PomodoroStates.LongBreak, PomodoroStates.Work, undefined],
    [PomodoroStates.Break, PomodoroStates.Work, undefined],
    [PomodoroStates.Work, PomodoroStates.Break, undefined],
    [PomodoroStates.Work, PomodoroStates.LongBreak, 4],
  ])(
    'should return correct next state',
    (currentState, expectedNextState, shortBreakCount) => {
      const pomodoro: Pomodoro = {
        ...getInitialPomodoro(),
        state: currentState,
        shortBreakCount: shortBreakCount ?? 0,
      };

      const nextState = getNextState(pomodoro, pomodoro);
      expect(nextState).toEqual(expectedNextState);
    }
  );
});
