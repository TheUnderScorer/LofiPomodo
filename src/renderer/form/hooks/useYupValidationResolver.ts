import { SchemaLike } from 'yup/lib/types';
import { useCallback } from 'react';
import { ResolverResult } from 'react-hook-form';
import { set } from 'lodash';
import { ValidationError } from 'yup';

export const useYupValidationResolver = (validationSchema: SchemaLike) =>
  useCallback(
    async (data: any): Promise<ResolverResult<any>> => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        const returnValue = {
          values: {},
          errors: {},
        };

        (errors as ValidationError).inner.forEach((error) => {
          set(returnValue.errors, error.path!, {
            type: error.type ?? 'validation',
            message: error.message,
          });
        });

        return returnValue;
      }
    },
    [validationSchema]
  );
