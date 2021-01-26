import { AnySchema } from 'yup';

export type YupObjectSchema<T> = {
  [Key in keyof T]: AnySchema<T[Key]>;
};
