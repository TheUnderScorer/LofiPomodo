import { Nullable } from '../../shared/types';

export interface FormInputProps<T> {
  value?: Nullable<T>;
  onChange?: (value: Nullable<T>) => any;
  name?: string;
}
