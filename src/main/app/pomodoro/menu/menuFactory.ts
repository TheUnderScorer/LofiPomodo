import { MenuItemConstructorOptions } from 'electron';
import { Duration, durations } from '../const/durations';

export const createDurationsMenu = (
  value: number,
  onSelect: (value: Duration) => void
): MenuItemConstructorOptions[] => {
  return durations.map((duration) => {
    console.log({ value, duration });
    return {
      label: duration.time.toDetailedString(),
      type: 'radio',
      click: () => {
        onSelect(duration);
      },
      checked: value === duration.seconds,
    };
  });
};
