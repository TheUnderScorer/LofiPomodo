import { getDurationByState, getNextState } from './nextState';
import { Pomodoro, PomodoroStateEnum } from '../../../../shared/types';
import { getInitialPomodoro } from '../data';

describe('Next state', () => {
  it.each<[PomodoroStateEnum, keyof Pomodoro]>([
    [PomodoroStateEnum.Break, 'shortBreakDurationSeconds'],
    [PomodoroStateEnum.LongBreak, 'longBreakDurationSeconds'],
    [PomodoroStateEnum.Work, 'workDurationSeconds'],
  ])('should return correct duration by state', (state, prop) => {
    const pomodoro: Pomodoro = {
      ...getInitialPomodoro(),
      state,
    };

    const duration = getDurationByState(pomodoro, state);
    expect(duration).toEqual(pomodoro[prop]);
  });

  it.each<[PomodoroStateEnum, PomodoroStateEnum, number | undefined]>([
    [PomodoroStateEnum.LongBreak, PomodoroStateEnum.Work, undefined],
    [PomodoroStateEnum.Break, PomodoroStateEnum.Work, undefined],
    [PomodoroStateEnum.Work, PomodoroStateEnum.Break, undefined],
    [PomodoroStateEnum.Work, PomodoroStateEnum.LongBreak, 4],
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
