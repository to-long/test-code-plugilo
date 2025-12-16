import { SwipeableCardDeck, useCardHandlers, useDragHandlers } from '@/features/cards';
import { Dock } from '@/features/dock';
import { useStackHandlers } from '@/features/stacks';
import { AppModals, CreateMenu, useModalState } from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from './shared/store/useStore';

export default function App() {
  // App-level state
  const { error, loadInitialData } = useAppStore();

  // Modal state
  const {
    modalType,
    editingCard,
    viewingCard,
    sharingCard,
    showCreateMenu,
    openCreateCard,
    openCreateStack,
    openEditCard,
    openViewDetail,
    openShare,
    closeModal,
    openCreateMenu,
    closeCreateMenu,
  } = useModalState();

  // Stack handlers
  const { stacks, activeStackId, handleCreateStack, handleStackSelect, handleCollapse } =
    useStackHandlers({ onSuccess: closeModal });

  // Card handlers
  const { activeCards, handleCreateCard, handleUpdateCard, handleDeleteCard, handleMoveCard } =
    useCardHandlers({ onSuccess: closeModal });

  // Drag handlers
  const {
    isDraggingToStacks,
    hoveredStackId,
    startDragging,
    stopDragging,
    handleDragEndWithPosition,
    handleDragPositionChange,
    handleStackDrop,
  } = useDragHandlers({ activeStackId, onMoveCard: handleMoveCard });

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

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
                onViewDetail={openViewDetail}
                onShare={openShare}
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
        onCollapse={handleCollapse}
      />

      {/* Create Menu */}
      <CreateMenu
        isOpen={showCreateMenu}
        onClose={closeCreateMenu}
        onCreateCard={openCreateCard}
        onCreateStack={openCreateStack}
      />

      {/* App Modals */}
      <AppModals
        modalType={modalType}
        editingCard={editingCard}
        viewingCard={viewingCard}
        sharingCard={sharingCard}
        stacks={stacks}
        onClose={closeModal}
        onCreateCard={handleCreateCard}
        onUpdateCard={(data) => editingCard && handleUpdateCard(editingCard.id, data)}
        onCreateStack={handleCreateStack}
      />
    </>
  );
}
