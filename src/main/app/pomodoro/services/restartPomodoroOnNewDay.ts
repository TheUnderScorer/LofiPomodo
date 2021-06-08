import { PomodoroService } from './pomodoroService/PomodoroService';

export const restartPomodoroOnNewDay = async (pomodoro: PomodoroService) => {
  if (!pomodoro.state.start || !(pomodoro.state.start instanceof Date)) {
    console.log('Not restarting pomodoro:', {
      start: pomodoro.state.start,
    });

    return;
  }

  const now = new Date();

  if (now.getDate() !== pomodoro.state.start.getDate()) {
    console.log('Restarting pomodoro...');

    await pomodoro.state.restart();
  }
};
