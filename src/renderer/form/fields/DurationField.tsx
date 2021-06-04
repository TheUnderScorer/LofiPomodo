import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { FormInputProps } from '../../types/form';
import {
  InputGroup,
  InputGroupProps,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from '@chakra-ui/react';
import { Select } from '../../ui/molecules/select/Select';
import { TimeUnits } from '../../../shared/types/units';
import { timeUnitsDictionaryShort } from '../../../shared/dictionary/units';
import { NumberStepper } from '../../ui/molecules/numberStepper/NumberStepper';

export interface DurationFieldProps
  extends FormInputProps<number>,
    Partial<Omit<InputGroupProps, 'onChange' | 'children'>> {
  inputProps?: Omit<NumberInputProps, 'value' | 'onChange'>;
}

const units = Object.values(TimeUnits);
const max = 9999;

export const DurationField = forwardRef<HTMLInputElement, DurationFieldProps>(
  (props, ref) => {
    const { name, value, onChange, inputProps, ...rest } = props;
    const [unit, setUnit] = useState<TimeUnits>(TimeUnits.Minutes);

    const parsedValue = useMemo(() => {
      if (value === null || value === undefined) {
        return null;
      }

      let formattedValue: number;

      switch (unit) {
        case TimeUnits.Hours:
          formattedValue = value / 60 / 60;

          break;

        case TimeUnits.Minutes:
          formattedValue = value / 60;
          break;

        case TimeUnits.Seconds:
        default:
          formattedValue = value;
      }

      return parseFloat(formattedValue.toPrecision(2));
    }, [unit, value]);

    const handleChange = useCallback(
      (value: string) => {
        if (!onChange) {
          return;
        }

        const parsed = parseFloat(value);

        if (Number.isNaN(parsed)) {
          onChange(0);

          return;
        }

        if (parsed > max) {
          onChange(max);

          return;
        }

        let converted: number;

        switch (unit) {
          case TimeUnits.Hours:
            converted = parsed * 60 * 60;
            break;

          case TimeUnits.Minutes:
            converted = parsed * 60;
            break;

          default:
            converted = parsed;
        }

        if (onChange) {
          onChange(converted);
        }
      },
      [onChange, unit]
    );

    return (
      <InputGroup minWidth="100px" maxWidth="200px" {...rest}>
        <NumberInput
          {...inputProps}
          value={parsedValue ?? ''}
          onChange={handleChange}
          precision={2}
          max={9999}
          ref={ref}
        >
          <NumberInputField name={name} />
          <NumberStepper />
        </NumberInput>
        <InputRightElement padding={0} right="12%" width="90px">
          <Select
            onChange={(event) => setUnit(event.target.value as TimeUnits)}
            borderRadius={0}
            color="brand.textPrimary"
            value={unit}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {timeUnitsDictionaryShort[unit]}
              </option>
            ))}
          </Select>
        </InputRightElement>
      </InputGroup>
    );
  }
);
