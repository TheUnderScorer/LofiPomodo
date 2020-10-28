import { secondsToTime, Time } from '../../../../shared/utils/time';

export interface Duration {
  time: Time;
  seconds: number;
}

/**
 * Possible pomodoro durations
 * */
export const durations: Duration[] = [
  180,
  300,
  600,
  900,
  1200,
  1500,
  1800,
  2100,
  2400,
  2700,
  3000,
  3300,
  3600,
].map((duration) => ({
  time: secondsToTime(duration),
  seconds: duration,
}));
