import { useEffect, useState } from 'react';
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
    loadInitialData,
  } = useStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isDraggingToStacks, setIsDraggingToStacks] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [hoveredStackId, setHoveredStackId] = useState<string | null>(null);

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

  // Helper to find stack ID at a given position
  const getStackIdAtPosition = (position: { x: number; y: number }): string | null => {
    const elementAtPoint = document.elementFromPoint(position.x, position.y);
    if (!elementAtPoint) return null;

    const stackElement = elementAtPoint.closest('[data-stack-id]');
    if (!stackElement) return null;

    return stackElement.getAttribute('data-stack-id');
  };

  const handleDragEndWithPosition = (cardId: string, position: { x: number; y: number }) => {
    const targetStackId = getStackIdAtPosition(position);

    // Clear hover state
    setHoveredStackId(null);

    if (!targetStackId) return;

    // Don't move if dropping on the same stack
    if (targetStackId === activeStackId) return;

    // Move the card to the target stack
    handleMoveCard(cardId, targetStackId);
  };

  const handleDragPositionChange = (position: { x: number; y: number } | null) => {
    if (!position) {
      setHoveredStackId(null);
      return;
    }

    const stackId = getStackIdAtPosition(position);
    // Only set hovered if it's a different stack than active
    setHoveredStackId(stackId !== activeStackId ? stackId : null);
  };

  return (
    <>
      {/* Card Deck - Only shown when a stack is selected */}
      {activeStackId && (
        <div className="fixed inset-0 z-40 pb-32">
          <main className="max-w-7xl mx-auto px-4 py-8 h-full">
            <SwipeableCardDeck
              cards={activeCards}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onDragStart={(cardId) => {
                setIsDraggingToStacks(true);
                setDraggingCardId(cardId);
              }}
              onDragEnd={() => {
                setIsDraggingToStacks(false);
                setDraggingCardId(null);
                setHoveredStackId(null);
              }}
              onDragEndWithPosition={handleDragEndWithPosition}
              onDragPositionChange={handleDragPositionChange}
            />
          </main>
        </div>
      )}

      {/* Error Toast with Liquid Glass Effect */}
      {error && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="relative px-6 py-3 rounded-2xl text-white backdrop-blur-xl border border-red-400/30 bg-red-500/20 shadow-[inset_0_1px_0px_rgba(255,255,255,0.2),0_0_20px_rgba(239,68,68,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-transparent to-transparent rounded-2xl pointer-events-none" />
            <span className="relative">{error}</span>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Always visible */}
      <Dock
        stacks={stacks}
        activeStackId={activeStackId}
        onStackSelect={(stackId) => {
          // Toggle: if clicking active stack, close it; otherwise open it
          if (activeStackId === stackId) {
            setActiveStack(null);
          } else {
            setActiveStack(stackId);
          }
        }}
        onCreateClick={() => setShowCreateMenu(true)}
        onSearchClick={() => {}}
        isDraggingCard={isDraggingToStacks}
        hoveredStackId={hoveredStackId}
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
    </>
  );
}
