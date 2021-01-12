import { UseFormMethods } from 'react-hook-form';
import { TrelloSettings } from '../../../../shared/types/integrations/trello';

export const validateDuplicateTrelloBoards = (
  form: UseFormMethods<TrelloSettings>,
  index: number
) => (val: any) => {
  if (!val) {
    return true;
  }

  const boardIds = form.getValues()?.boards?.map((board) => board.boardId);

  const selectedBoardIndex = boardIds?.indexOf(val);

  if (selectedBoardIndex !== undefined && selectedBoardIndex !== index) {
    return 'This board was selected previously.';
  }

  return true;
};
