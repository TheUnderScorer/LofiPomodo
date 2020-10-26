import { dialog } from 'electron';
import { AppError } from '../../../errors/AppError';

export const createErrorDialog = async (error: Error) => {
  await dialog.showMessageBox({
    type: 'error',
    title: error instanceof AppError ? error.title : 'Error occured',
    message: error.message,
  });
};
