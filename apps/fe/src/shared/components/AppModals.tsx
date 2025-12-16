import { CardForm, CardDetail, ShareCard } from '@/features/cards/components';
import { StackForm } from '@/features/stacks';
import { Modal } from './Modal';
import type { Card } from '@/features/cards';
import type { Stack } from '@/features/stacks';
import type { ModalType } from '../types';
import type { CardFormData } from '@/features/cards';
import type { StackFormData } from '@/features/stacks';

interface AppModalsProps {
  modalType: ModalType;
  editingCard: Card | null;
  viewingCard: Card | null;
  sharingCard: Card | null;
  stacks: Stack[];
  onClose: () => void;
  onCreateCard: (data: CardFormData) => void;
  onUpdateCard: (data: CardFormData) => void;
  onCreateStack: (data: StackFormData) => void;
}

/**
 * Component that renders all application modals
 */
export function AppModals({
  modalType,
  editingCard,
  viewingCard,
  sharingCard,
  stacks,
  onClose,
  onCreateCard,
  onUpdateCard,
  onCreateStack,
}: AppModalsProps) {
  return (
    <>
      {/* Create Card Modal */}
      <Modal isOpen={modalType === 'create-card'} onClose={onClose} title="Create Card">
        <CardForm stacks={stacks} onSubmit={onCreateCard} onCancel={onClose} />
      </Modal>

      {/* Edit Card Modal */}
      <Modal isOpen={modalType === 'edit-card'} onClose={onClose} title="Edit Card">
        <CardForm
          card={editingCard || undefined}
          stacks={stacks}
          onSubmit={onUpdateCard}
          onCancel={onClose}
        />
      </Modal>

      {/* Create Stack Modal */}
      <Modal isOpen={modalType === 'create-stack'} onClose={onClose} title="Create Stack">
        <StackForm onSubmit={onCreateStack} onCancel={onClose} />
      </Modal>

      {/* View Detail Modal */}
      <Modal isOpen={modalType === 'view-detail'} onClose={onClose} title="Card Details">
        {viewingCard && <CardDetail card={viewingCard} />}
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={modalType === 'share'} onClose={onClose} title="Share Card">
        {sharingCard && <ShareCard card={sharingCard} />}
      </Modal>
    </>
  );
}

