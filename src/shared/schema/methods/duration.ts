import * as yup from 'yup';

yup.addMethod(yup.number, 'duration', function () {
  return this.min(1, 'Value must be larger than 0')
    .max(9999, 'Value must be lesser than 9999')
    .required();
});
