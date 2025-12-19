import { useCardHandlers, useDragHandlers } from '@/features/cards';
import { Dock } from '@/features/dock';
import { useStackHandlers } from '@/features/stacks';
import { AppModals, CreateMenu, useModalState } from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { lazy } from 'react';
import { useAppStore } from './shared/store/useStore';

const SwipeableCardDeck = lazy(() =>
  import('@/features/cards').then((mod) => ({ default: mod.SwipeableCardDeck })),
);

type AppProps = {
  theme?: string;
};

export default function App({ theme = 'light' }: AppProps) {
  // global state
  const { error, loadInitialData, setRootElement } = useAppStore();

  const rootRef = useRef<HTMLElement>(null);
  const { theme: currentTheme, switchTheme } = useAppStore();

  useEffect(() => {
    // Set root element reference for Shadow DOM support in drag handlers
    if (rootRef.current) {
      setRootElement(rootRef.current);
    }
    return () => setRootElement(null);
  }, []);

  useEffect(() => {
    if (!currentTheme) {
      switchTheme(theme);
    } else if (currentTheme && rootRef.current) {
      for (const className of rootRef.current.classList) {
        rootRef.current.classList.remove(className);
      }
      rootRef.current.classList.add(currentTheme);
    }
  }, [currentTheme, theme, switchTheme]);

  // Modal state
  const {
    modalType,
    editingCard,
    viewingCard,
    sharingCard,
    editingStack,
    deletingStack,
    showCreateMenu,
    openCreateCard,
    openCreateStack,
    openEditCard,
    openEditStack,
    openDeleteStack,
    openViewDetail,
    openShare,
    closeModal,
    openCreateMenu,
    closeCreateMenu,
  } = useModalState();

  // Stack handlers
  const {
    stacks,
    activeStackId,
    getStackById,
    handleCreateStack,
    handleUpdateStack,
    handleDeleteStack,
    handleStackSelect,
    handleCollapse,
  } = useStackHandlers({ onSuccess: closeModal });

  // Stack edit/delete handlers
  const handleStackEdit = useCallback(
    (stackId: string) => {
      const stack = getStackById(stackId);
      if (stack) {
        openEditStack(stack);
      }
    },
    [getStackById, openEditStack],
  );

  const handleStackDeleteClick = useCallback(
    (stackId: string) => {
      const stack = getStackById(stackId);
      if (stack) {
        openDeleteStack(stack);
      }
    },
    [getStackById, openDeleteStack],
  );

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
    <main ref={rootRef}>
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
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="fixed top-20 right-4 z-50 animate-slide-in"
        >
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
        onStackEdit={handleStackEdit}
        onStackDelete={handleStackDeleteClick}
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
        editingStack={editingStack}
        deletingStack={deletingStack}
        stacks={stacks}
        onClose={closeModal}
        onCreateCard={handleCreateCard}
        onUpdateCard={(data) => editingCard && handleUpdateCard(editingCard.id, data)}
        onCreateStack={handleCreateStack}
        onUpdateStack={(data) => editingStack && handleUpdateStack(editingStack.id, data)}
        onDeleteStack={() => deletingStack && handleDeleteStack(deletingStack.id)}
      />
    </main>
  );
}
