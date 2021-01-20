import { PomodoroService } from './pomodoroService/PomodoroService';

export const restartPomodoroOnNewDay = async (pomodoro: PomodoroService) => {
  if (!pomodoro.start || !(pomodoro.start instanceof Date)) {
    console.log('Not restarting pomodoro:', { start: pomodoro.start });

    return;
  }

  const now = new Date();

  if (now.getDate() !== pomodoro.start.getDate()) {
    console.log('Restarting pomodoro...');

    await pomodoro.restart();
  }
};
