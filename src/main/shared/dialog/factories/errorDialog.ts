import { dialog } from 'electron';
import { AppError } from '../../../../shared/errors/AppError';

export const createErrorDialog = async (error: Error) => {
  await dialog.showMessageBox({
    type: 'error',
    title: error instanceof AppError ? error.title : 'Error occured',
    message: error.message,
  });
};
