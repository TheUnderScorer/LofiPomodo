import React, { ChangeEventHandler } from 'react';
import { Text } from '../text/Text';
import classNames from 'classnames';
import { usePrefersColorScheme } from '../../../shared/hooks/usePrefersColorScheme';

export interface PixelRadioProps {
  name: string;
  isChecked?: boolean;
  className?: string;
  label: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  id?: string;
}

export const PixelRadio = ({
  isChecked,
  className,
  label,
  name,
  onChange,
  id,
}: PixelRadioProps) => {
  const colorMode = usePrefersColorScheme();

  return (
    <label>
      <input
        id={id}
        type="radio"
        className={classNames(className, 'nes-radio', {
          'is-dark': colorMode === 'dark',
        })}
        name={name}
        checked={isChecked}
        onChange={onChange}
      />
      <Text as="span">{label}</Text>
    </label>
  );
};
