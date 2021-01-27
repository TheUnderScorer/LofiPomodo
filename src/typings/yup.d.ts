/* eslint-disable @typescript-eslint/no-unused-vars */
import 'yup';

declare module 'yup' {
  interface NumberSchema {
    duration(this: NumberSchema): NumberSchema;
    transformInt(this: NumberSchema): NumberSchema;
  }
}
