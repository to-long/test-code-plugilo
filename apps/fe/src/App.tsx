import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { CardForm } from './components/CardForm';
import { CreateMenu } from './components/CreateMenu';
import { Modal } from './components/Modal';
import { StackForm } from './components/StackForm';
import { SwipeableCardDeck } from './components/SwipeableCardDeck';
import { Dock } from './features/dock/components/Dock';
import { getStackIdAtPosition, useDragState, useModalState } from './hooks';
import { useStore } from './store/useStore';

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

  const {
    modalType,
    editingCard,
    showCreateMenu,
    openCreateCard,
    openCreateStack,
    openEditCard,
    closeModal,
    openCreateMenu,
    closeCreateMenu,
  } = useModalState();

  const {
    isDraggingToStacks,
    draggingCardId,
    hoveredStackId,
    startDragging,
    stopDragging,
    updateHoveredStack,
  } = useDragState();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const activeCards = getActiveCards();

  // Card handlers
  const handleCreateCard = useCallback(
    async (data: { name: string; description: string; cover: string; stackId: string }) => {
      try {
        await createCard(data);
        closeModal();
      } catch (err) {
        console.error('Failed to create card:', err);
      }
    },
    [createCard, closeModal]
  );

  const handleUpdateCard = useCallback(
    async (data: { name: string; description: string; cover: string; stackId: string }) => {
      if (!editingCard) return;
      try {
        await updateCard(editingCard.id, data);
        closeModal();
      } catch (err) {
        console.error('Failed to update card:', err);
      }
    },
    [editingCard, updateCard, closeModal]
  );

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      try {
        await deleteCard(cardId);
      } catch (err) {
        console.error('Failed to delete card:', err);
      }
    },
    [deleteCard]
  );

  // Stack handlers
  const handleCreateStack = useCallback(
    async (data: { name: string; cover: string }) => {
      try {
        await createStack(data.name, data.cover);
        closeModal();
      } catch (err) {
        console.error('Failed to create stack:', err);
      }
    },
    [createStack, closeModal]
  );

  const handleMoveCard = useCallback(
    async (cardId: string, targetStackId: string) => {
      try {
        await moveCard(cardId, targetStackId);
        stopDragging();
      } catch (err) {
        console.error('Failed to move card:', err);
      }
    },
    [moveCard, stopDragging]
  );

  // Drag handlers
  const handleDragEndWithPosition = useCallback(
    (cardId: string, position: { x: number; y: number }) => {
      const targetStackId = getStackIdAtPosition(position);
      updateHoveredStack(null);

      if (!targetStackId || targetStackId === activeStackId) return;

      handleMoveCard(cardId, targetStackId);
    },
    [activeStackId, handleMoveCard, updateHoveredStack]
  );

  const handleDragPositionChange = useCallback(
    (position: { x: number; y: number } | null) => {
      if (!position) {
        updateHoveredStack(null);
        return;
      }

      const stackId = getStackIdAtPosition(position);
      updateHoveredStack(stackId !== activeStackId ? stackId : null);
    },
    [activeStackId, updateHoveredStack]
  );

  const handleStackSelect = useCallback(
    (stackId: string) => {
      setActiveStack(activeStackId === stackId ? null : stackId);
    },
    [activeStackId, setActiveStack]
  );

  const handleStackDrop = useCallback(
    (stackId: string) => {
      if (draggingCardId) {
        handleMoveCard(draggingCardId, stackId);
      }
    },
    [draggingCardId, handleMoveCard]
  );

  return (
    <>
      {/* Card Deck - Only shown when a stack is selected */}
      <AnimatePresence mode="wait">
        {activeStackId && (
          <motion.div
            key={activeStackId}
            className="fixed inset-0 z-40 pb-32"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <main className="max-w-7xl mx-auto px-4 py-8 h-full">
              <SwipeableCardDeck
                cards={activeCards}
                onEdit={openEditCard}
                onDelete={handleDeleteCard}
                onDragStart={startDragging}
                onDragEnd={stopDragging}
                onDragEndWithPosition={handleDragEndWithPosition}
                onDragPositionChange={handleDragPositionChange}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

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
        onStackSelect={handleStackSelect}
        onCreateClick={openCreateMenu}
        onSearchClick={() => {}}
        isDraggingCard={isDraggingToStacks}
        hoveredStackId={hoveredStackId}
        onStackDrop={handleStackDrop}
        onCollapse={() => setActiveStack(null)}
      />

      {/* Create Menu */}
      <CreateMenu
        isOpen={showCreateMenu}
        onClose={closeCreateMenu}
        onCreateCard={openCreateCard}
        onCreateStack={openCreateStack}
      />

      {/* Create Card Modal */}
      <Modal isOpen={modalType === 'create-card'} onClose={closeModal} title="Create Card">
        <CardForm stacks={stacks} onSubmit={handleCreateCard} onCancel={closeModal} />
      </Modal>

      {/* Edit Card Modal */}
      <Modal isOpen={modalType === 'edit-card'} onClose={closeModal} title="Edit Card">
        <CardForm
          card={editingCard || undefined}
          stacks={stacks}
          onSubmit={handleUpdateCard}
          onCancel={closeModal}
        />
      </Modal>

      {/* Create Stack Modal */}
      <Modal isOpen={modalType === 'create-stack'} onClose={closeModal} title="Create Stack">
        <StackForm onSubmit={handleCreateStack} onCancel={closeModal} />
      </Modal>
    </>
  );
}
