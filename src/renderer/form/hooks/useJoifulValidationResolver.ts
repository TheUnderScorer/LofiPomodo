import {
  BaseSchema,
  BaseSchemaConstructor,
} from '../../../shared/schema/BaseSchema';
import { useCallback } from 'react';
import { ResolverResult } from 'react-hook-form';
import { ValidationError } from '../../../shared/schema/ValidationError';
import { set } from 'lodash';

export const useJoifulValidationResolver = <T>(
  schema: BaseSchemaConstructor<BaseSchema<T>>
) =>
  useCallback(
    async (data: any): Promise<ResolverResult<any>> => {
      try {
        const values = schema.validate(data);

        return {
          values,
          errors: {},
        };
      } catch (error) {
        const result = {
          values: {},
          errors: {},
        };

        if (!(error instanceof ValidationError)) {
          throw error;
        }

        error.details.forEach((detail) => {
          set(result.errors, detail.path, {
            type: detail.type ?? 'validation',
            message: detail.message,
          });
        });

        return result;
      }
    },
    [schema]
  );
