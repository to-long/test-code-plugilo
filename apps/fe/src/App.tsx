import { useState } from 'react';
import { CardForm } from './components/CardForm';
import { CreateMenu } from './components/CreateMenu';
import { Modal } from './components/Modal';
import { StackForm } from './components/StackForm';
import { SwipeableCardDeck } from './components/SwipeableCardDeck';
import { Dock } from './features/dock/components/Dock';
import { useStore } from './store/useStore';
import type { Card, ModalType } from './types';

export default function App() {
  const {
    stacks,
    activeStackId,
    error,
    createStack,
    setActiveStack,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    getActiveCards,
  } = useStore();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isDraggingToStacks, setIsDraggingToStacks] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const activeCards = getActiveCards();

  const handleCreateCard = async (data: {
    name: string;
    description: string;
    cover: string;
    stackId: string;
  }) => {
    try {
      await createCard(data);
      setModalType(null);
    } catch (err) {
      console.error('Failed to create card:', err);
    }
  };

  const handleUpdateCard = async (data: {
    name: string;
    description: string;
    cover: string;
    stackId: string;
  }) => {
    if (!editingCard) return;
    try {
      await updateCard(editingCard.id, data);
      setModalType(null);
      setEditingCard(null);
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const handleCreateStack = async (data: { name: string; cover: string }) => {
    try {
      await createStack(data.name, data.cover);
      setModalType(null);
    } catch (err) {
      console.error('Failed to create stack:', err);
    }
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setModalType('edit-card');
  };

  const handleMoveCard = async (cardId: string, targetStackId: string) => {
    try {
      await moveCard(cardId, targetStackId);
      setIsDraggingToStacks(false);
    } catch (err) {
      console.error('Failed to move card:', err);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {stacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-8">
              <svg
                className="w-32 h-32 mx-auto text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">No Stacks Yet</h2>
              <p className="text-gray-400 mb-6">Create your first stack to get started</p>
              <button
                onClick={() => setModalType('create-stack')}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg font-medium transition-all"
              >
                Create Stack
              </button>
            </div>
          </div>
        ) : (
          <SwipeableCardDeck
            cards={activeCards}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            onMove={handleMoveCard}
            stacks={stacks}
            isDraggingToStacks={isDraggingToStacks}
            onDragStart={(cardId) => {
              setIsDraggingToStacks(true);
              setDraggingCardId(cardId);
            }}
            onDragEnd={() => {
              setIsDraggingToStacks(false);
              setDraggingCardId(null);
            }}
          />
        )}
      </main>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          {error}
        </div>
      )}

      {/* Bottom Navigation */}
      <Dock
        stacks={stacks}
        activeStackId={activeStackId}
        onStackSelect={setActiveStack}
        onCreateClick={() => setShowCreateMenu(true)}
        onSearchClick={() => alert('Search functionality coming soon!')}
        isDraggingCard={isDraggingToStacks}
        onStackDrop={(stackId) => {
          if (draggingCardId) {
            handleMoveCard(draggingCardId, stackId);
          }
        }}
      />

      {/* Create Menu */}
      <CreateMenu
        isOpen={showCreateMenu}
        onClose={() => setShowCreateMenu(false)}
        onCreateCard={() => setModalType('create-card')}
        onCreateStack={() => setModalType('create-stack')}
      />

      {/* Create Card Modal */}
      <Modal
        isOpen={modalType === 'create-card'}
        onClose={() => setModalType(null)}
        title="Create Card"
      >
        <CardForm stacks={stacks} onSubmit={handleCreateCard} onCancel={() => setModalType(null)} />
      </Modal>

      {/* Edit Card Modal */}
      <Modal
        isOpen={modalType === 'edit-card'}
        onClose={() => {
          setModalType(null);
          setEditingCard(null);
        }}
        title="Edit Card"
      >
        <CardForm
          card={editingCard || undefined}
          stacks={stacks}
          onSubmit={handleUpdateCard}
          onCancel={() => {
            setModalType(null);
            setEditingCard(null);
          }}
        />
      </Modal>

      {/* Create Stack Modal */}
      <Modal
        isOpen={modalType === 'create-stack'}
        onClose={() => setModalType(null)}
        title="Create Stack"
      >
        <StackForm onSubmit={handleCreateStack} onCancel={() => setModalType(null)} />
      </Modal>
    </div>
  );
}
