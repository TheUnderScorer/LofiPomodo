import {
  useFieldArray,
  UseFieldArrayOptions,
  UseFormMethods,
} from 'react-hook-form';
import { ReactNode, useCallback, useState } from 'react';

export interface RemovableFieldArrayHookProps
  extends Omit<UseFieldArrayOptions<any>, 'control'> {
  form: UseFormMethods;
}

export const useRemovableFieldArray = <T>(
  props: RemovableFieldArrayHookProps
) => {
  const { form, ...rest } = props;

  const { fields } = useFieldArray<T, any>({
    ...rest,
    control: form.control,
  });

  const [indexes, setIndexes] = useState(fields.map((_, index) => index));

  const append = useCallback(
    (value: T) => {
      const newIndex = fields.length;
      const newFields = [...fields, value];

      form.setValue(props.name, newFields);

      setIndexes((prev) => [...prev, newIndex]);
    },
    [fields, form, props.name]
  );

  const map = useCallback(
    (callback: (item: T, index: number) => ReactNode) => {
      return indexes.map((index) => {
        const item = fields[index];

        return callback(item as T, index);
      });
    },
    [indexes, fields]
  );

  const remove = useCallback(
    (index: number) => {
      const newIndexes = indexes.filter((savedIndex) => savedIndex !== index);
      setIndexes(newIndexes);

      const newValue = [...fields];
      (newValue as any)[index] = null;

      form.setValue(props.name, newValue);
    },
    [fields, form, indexes, props.name]
  );

  return {
    fields,
    append,
    indexes,
    map,
    remove,
  };
};
