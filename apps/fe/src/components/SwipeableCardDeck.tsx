import { type PanInfo, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Card } from '../types';
import { CardItem } from './CardItem';

interface SwipeableCardDeckProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onMove: (cardId: string, targetStackId: string) => void;
  stacks: Array<{ id: string; name: string }>;
  isDraggingToStacks: boolean;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
}

export function SwipeableCardDeck({
  cards,
  onEdit,
  onDelete,
  onMove,
  stacks,
  isDraggingToStacks,
  onDragStart,
  onDragEnd,
}: SwipeableCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  // Motion values for smooth animations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform x position to rotation for natural card tilt
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  // Transform x position to opacity for fade effect
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const currentCard = cards[currentIndex];

  // Reset motion values when card changes
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [currentCard.id, x, y]);

  const handleDragStart = () => {
    setIsDraggingCard(true);
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;

    // Show delete zone when dragging up
    if (offset.y < -50) {
      setShowDeleteZone(true);
      if (currentCard) onDragStart(currentCard.id);
    } else if (offset.y > 50) {
      // Show stack selector when dragging down
      if (currentCard) onDragStart(currentCard.id);
    } else {
      setShowDeleteZone(false);
      onDragEnd();
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    setIsDraggingCard(false);

    // Handle swipe actions - any swipe moves card to end of stack
    if (Math.abs(offset.x) > 150 || Math.abs(velocity.x) > 500 || Math.abs(offset.y) > 150) {
      // Swiped in any direction - move current card to end of stack immediately
      // Wrap around to beginning if we reach the end
      setCurrentIndex((i) => (i + 1) % cards.length);
    } else {
      // Not swiped - reset position
      x.set(0);
      y.set(0);
    }

    // Reset delete zone and notify parent
    setShowDeleteZone(false);
    onDragEnd();
  };

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-xl">No cards in this stack</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Delete Zone */}
      {showDeleteZone && (
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 20 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6 }}
            className="bg-red-500 text-white p-4 rounded-full shadow-2xl"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Card Stack Preview */}
      <div className="relative h-[600px] w-full max-w-sm mx-auto">
        {/* Background cards - stacked with visible corners (show up to 5 cards) */}
        {Array.from({ length: Math.min(5, cards.length - 1) }, (_, i) => {
          // Create circular array - wrap around to beginning if needed
          const cardIndex = (currentIndex + 1 + i) % cards.length;
          const card = cards[cardIndex];
          const stackIndex = i + 1;
          // Scale decreases slightly for cards further back
          const baseScale = 1 - stackIndex * 0.04;
          // When dragging, next card scales up slightly (preview effect)
          const scale = isDraggingCard && stackIndex === 1 ? baseScale + 0.03 : baseScale;

          // Y offset increases to show top edge of cards behind
          const baseTranslateY = stackIndex * 15;
          // When dragging, next card moves up slightly
          const translateY =
            isDraggingCard && stackIndex === 1 ? baseTranslateY - 8 : baseTranslateY;

          // X offset alternates left/right to show side corners - increased for better visibility
          const baseTranslateX = stackIndex % 2 === 0 ? stackIndex * 15 : -stackIndex * 15;
          // When dragging, next card centers slightly
          const translateX =
            isDraggingCard && stackIndex === 1 ? baseTranslateX * 0.5 : baseTranslateX;

          // Rotation for stacking effect - alternates left/right
          const baseRotate = stackIndex % 2 === 0 ? stackIndex * 2 : -stackIndex * 2;
          // When dragging, next card straightens
          const rotate = isDraggingCard && stackIndex === 1 ? baseRotate * 0.3 : baseRotate;

          // Slight opacity reduction for depth perception
          const baseOpacity = 1 - stackIndex * 0.12;
          // When dragging, next card brightens
          const cardOpacity = isDraggingCard && stackIndex === 1 ? baseOpacity + 0.1 : baseOpacity;

          return (
            <div
              key={card.id}
              className="absolute top-0 left-0 w-full pointer-events-none"
              style={{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity: cardOpacity,
                transformOrigin: 'top center',
                zIndex: 10 - stackIndex,
                transition:
                  isDraggingCard && stackIndex === 1
                    ? 'transform 0.3s ease-out, opacity 0.3s ease-out'
                    : 'none',
              }}
            >
              <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
            </div>
          );
        })}

        {/* Current card with drag functionality */}
        <motion.div
          key={currentCard.id}
          className="absolute top-0 left-0 w-full cursor-grab active:cursor-grabbing touch-none"
          style={{
            x,
            y,
            rotate,
            opacity,
            transformOrigin: 'bottom left',
            zIndex: 20,
          }}
          drag
          dragElastic={1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
          initial={false}
        >
          <CardItem
            card={currentCard}
            onEdit={() => onEdit(currentCard)}
            onDelete={() => onDelete(currentCard.id)}
          />
        </motion.div>
      </div>

      {/* Card Counter */}
      {/* <div className="text-center mt-4 text-gray-400">
        {currentIndex + 1} / {cards.length}
      </div> */}
    </div>
  );
}
