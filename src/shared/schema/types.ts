import { AnySchema } from 'yup';
import Reference from 'yup/lib/Reference';
import Lazy from 'yup/lib/Lazy';

export type YupObjectSchema<T> = {
  [Key in keyof T]: AnySchema | Reference | Lazy<any, any>;
};
