import { noop } from '../../main/shared/i18n/noop';

export interface Time {
  hours: number;
  minutes: number;
  seconds: number;
  toClockString: () => string;
  toDetailedString: () => string;
}

export const timeToClockString = (time: Time) => {
  const timeArr = [];

  if (time.hours) {
    timeArr.push(time.hours);
  }

  timeArr.push(time.minutes);
  timeArr.push(time.seconds);

  return timeArr.map((val) => (val < 10 ? `0${val}` : val)).join(':');
};

export const timeToDetailedString = (time: Time) => {
  const result = [];

  if (time.hours) {
    result.push(`${time.hours} ${noop(time.hours, 'hour', 'hours')}`);
  }

  if (time.minutes) {
    result.push(`${time.minutes} ${noop(time.minutes, 'minute', 'minutes')}`);
  }

  if (time.seconds) {
    result.push(`${time.seconds} ${noop(time.seconds, 'second', 'seconds')}`);
  }

  return result.join(' ');
};

export const secondsToTime = (seconds: number): Time => {
  return {
    hours: Math.floor(seconds / 60 / 60),
    minutes: Math.floor((seconds / 60) % 60),
    seconds: Math.floor(seconds % 60),
    toClockString() {
      return timeToClockString(this);
    },
    toDetailedString() {
      return timeToDetailedString(this);
    },
  };
};
