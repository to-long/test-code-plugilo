import { type PanInfo, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Card } from '../types';
import { CardItem } from './CardItem';

// Constants
const BASE_CARD_SCALE = 0.65;
const DELETE_OFFSET_THRESHOLD = -180;
const MAX_DELETE_HORIZONTAL_OFFSET = 120;
const SWIPE_THRESHOLD = 150;
const MIN_DRAG_SCALE = BASE_CARD_SCALE * 0.5;

// Deck stack constants
const DECK_OFFSET_X = 6;
const DECK_OFFSET_Y = 8;
const DECK_SCALE_STEP = 0.012;
const DECK_ROTATE_STEP = 1.5;
const MAX_VISIBLE_CARDS = 4;

interface SwipeableCardDeckProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
}

export function SwipeableCardDeck({
  cards,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: SwipeableCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDeleteZone, setShowDeleteZone] = useState(false);
  const [isOverDeleteIcon, setIsOverDeleteIcon] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform y position to scale (shrink when dragging up toward delete)
  const scale = useTransform(
    y,
    [DELETE_OFFSET_THRESHOLD, -80, 0, 200],
    [MIN_DRAG_SCALE, BASE_CARD_SCALE * 0.7, BASE_CARD_SCALE, BASE_CARD_SCALE]
  );

  // Transform x position to rotation for natural card tilt
  const rotate = useTransform(x, [-200, 200], [-25, 25]);

  // Transform x position to opacity for fade effect
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const currentCard = cards[currentIndex];

  // Reset motion values when card changes
  useEffect(() => {
    x.set(0);
    y.set(0);
  }, [currentCard?.id, x, y]);

  const resetMotionValues = () => {
    x.set(0);
    y.set(0);
  };

  const resetState = () => {
    setShowDeleteZone(false);
    setIsOverDeleteIcon(false);
    setSwipeProgress(0);
  };

  const handleDragStart = () => {
    // Can be used for haptic feedback or other effects
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;

    // Calculate swipe progress (0 to 1)
    const progress = Math.min(Math.abs(offset.x) / SWIPE_THRESHOLD, 1);
    setSwipeProgress(progress);

    // Show delete zone when dragging up
    if (offset.y < -50) {
      setShowDeleteZone(true);
      if (currentCard) onDragStart(currentCard.id);

      const isOver =
        offset.y < DELETE_OFFSET_THRESHOLD &&
        Math.abs(offset.x) < MAX_DELETE_HORIZONTAL_OFFSET;
      setIsOverDeleteIcon(isOver);
    } else if (offset.y > 50) {
      if (currentCard) onDragStart(currentCard.id);
      setIsOverDeleteIcon(false);
    } else {
      setShowDeleteZone(false);
      setIsOverDeleteIcon(false);
      onDragEnd();
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    // Check for delete attempt
    const isDeleteAttempt =
      showDeleteZone &&
      offset.y < DELETE_OFFSET_THRESHOLD &&
      Math.abs(offset.x) < MAX_DELETE_HORIZONTAL_OFFSET;

    if (isDeleteAttempt && currentCard) {
      onDelete(currentCard.id);
      setCurrentIndex((i) => (i >= cards.length - 1 ? 0 : i));
      resetState();
      resetMotionValues();
      onDragEnd();
      return;
    }

    // Check for swipe
    const shouldSwipe =
      Math.abs(offset.x) > SWIPE_THRESHOLD ||
      Math.abs(velocity.x) > 500 ||
      Math.abs(offset.y) > SWIPE_THRESHOLD;

    if (shouldSwipe) {
      setCurrentIndex((i) => (i + 1) % cards.length);
    }

    resetState();
    resetMotionValues();
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

  const isOver50 = swipeProgress > 0.5;
  const riseProgress = isOver50 ? (swipeProgress - 0.5) * 2 : 0;

  const renderBackgroundCards = () => {
    const totalBackground = Math.min(MAX_VISIBLE_CARDS, cards.length - 1);
    if (totalBackground <= 0) return null;

    return Array.from({ length: totalBackground }, (_, i) => {
      const depth = totalBackground - i;
      const cardIndex = (currentIndex + depth) % cards.length;
      const card = cards[cardIndex];
      const isNextCard = depth === 1;

      // Default positions
      let translateX = depth * DECK_OFFSET_X;
      let translateY = depth * DECK_OFFSET_Y;
      let cardRotate = depth * DECK_ROTATE_STEP;
      let cardScale = BASE_CARD_SCALE - depth * DECK_SCALE_STEP;
      let cardOpacity = 1 - depth * 0.08;

      // Next card rises up when swiping past 50%
      if (isNextCard && riseProgress > 0) {
        translateX = DECK_OFFSET_X * (1 - riseProgress);
        translateY = DECK_OFFSET_Y * (1 - riseProgress);
        cardRotate = DECK_ROTATE_STEP * (1 - riseProgress);
        cardScale = BASE_CARD_SCALE - DECK_SCALE_STEP + DECK_SCALE_STEP * riseProgress;
        cardOpacity = 1;
      }

      const cardZIndex = isNextCard && isOver50 ? 25 : 10 - depth;

      return (
        <motion.div
          key={card.id}
          className="absolute w-full pointer-events-none"
          animate={{
            x: translateX,
            y: translateY,
            rotate: cardRotate,
            scale: cardScale,
            opacity: cardOpacity,
          }}
          transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
          style={{ transformOrigin: 'center center', zIndex: cardZIndex }}
        >
          <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
        </motion.div>
      );
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Delete Zone */}
      {showDeleteZone && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400/50 blur-xl"
              animate={
                isOverDeleteIcon
                  ? { scale: [1.1, 1.35, 1.1], opacity: [0.8, 1, 0.8] }
                  : { scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }
              }
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.div
              animate={
                isOverDeleteIcon
                  ? { y: [0, -6, 0], scale: [1.1, 1.25, 1.1] }
                  : { y: [0, -10, 0], scale: [1, 1.1, 1] }
              }
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              className={`relative bg-red-500/80 text-white p-4 rounded-full backdrop-blur-xl shadow-[0_0_40px_rgba(248,113,113,0.7)] border ${
                isOverDeleteIcon
                  ? 'border-white/80 ring-4 ring-white/70'
                  : 'border-white/30 ring-2 ring-white/30'
              }`}
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
          </div>
        </motion.div>
      )}

      {/* Card Deck */}
      <div className="relative h-[600px] w-full max-w-sm mx-auto flex items-center justify-center">
        {renderBackgroundCards()}

        {/* Current card */}
        <motion.div
          key={currentCard.id}
          className="absolute cursor-grab active:cursor-grabbing touch-none"
          style={{
            x,
            y,
            rotate,
            opacity,
            scale,
            transformOrigin: 'center center',
            zIndex: isOver50 ? 15 : 20,
          }}
          drag
          dragElastic={0.8}
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
    </div>
  );
}
