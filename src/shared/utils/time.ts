import { ToString } from '../types';

export interface Time extends ToString {
  hours: number;
  minutes: number;
  seconds: number;
}

export const timeToString = (time: Time) => {
  const timeArr = [];

  if (time.hours) {
    timeArr.push(time.hours);
  }

  timeArr.push(time.minutes);
  timeArr.push(time.seconds);

  return timeArr.map(val => (val < 10 ? `0${val}` : val)).join(':');
};

export const secondsToTime = (seconds: number): Time => {
  return {
    hours: Math.floor(seconds / 60 / 60),
    minutes: Math.floor((seconds / 60) % 60),
    seconds: Math.floor(seconds % 60),
    toString() {
      return timeToString(this);
    },
  };
};
