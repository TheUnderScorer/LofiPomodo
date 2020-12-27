import { PomodoroService } from './pomodoroService/PomodoroService';

export const restartPomodoroOnNewDay = async (pomodoro: PomodoroService) => {
  if (!pomodoro.start || !(pomodoro.start instanceof Date)) {
    return;
  }

  const now = new Date();

  if (now.getDate() > pomodoro.start.getDate()) {
    await pomodoro.restart();
  }
};
