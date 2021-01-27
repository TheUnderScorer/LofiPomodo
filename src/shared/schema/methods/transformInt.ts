import * as yup from 'yup';

yup.addMethod(yup.number, 'transformInt', function () {
  return this.transform((value) => {
    const parsed = parseInt(value);

    return Number.isNaN(parsed) ? undefined : parsed;
  });
});
