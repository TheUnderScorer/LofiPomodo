import { FC, useCallback } from 'react';
import { Modal } from '../../../../ui/molecules/modal/Modal';
import { Text } from '../../../../ui/atoms/text/Text';
import { useIpcInvoke } from '../../../../shared/ipc/useIpcInvoke';
import { IntegrationEvents } from '../../../../../shared/types/integrations/integrations';
import { TrelloBoard } from '../../../../../shared/types/integrations/trello';
import { useModalState } from '../../../../providers/modalProvider/ModalProvider';
import { ManageTrello } from './ManageTrello';

export interface ManageTrelloModalProps {}

export const manageTrelloModalId = 'manage_trello';

export const ManageTrelloModal: FC<ManageTrelloModalProps> = () => {
  const [getBoards, { loading, result }] = useIpcInvoke<never, TrelloBoard[]>(
    IntegrationEvents.GetTrelloBoards
  );

  const handleChange = useCallback(
    async (open: boolean) => {
      if (open) {
        await getBoards();
      }
    },
    [getBoards]
  );

  useModalState({ id: manageTrelloModalId, onChange: handleChange });

  return (
    <Modal
      size="lg"
      loading={loading}
      title={<Text>Manage trello</Text>}
      id={manageTrelloModalId}
    >
      <ManageTrello boards={result ?? []} />
    </Modal>
  );
};
