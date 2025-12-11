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
	  const [isOverDeleteIcon, setIsOverDeleteIcon] = useState(false);
	  const BASE_CARD_SCALE = 0.65; // slightly larger base scale, vẫn giữ đúng tỉ lệ 226x359
	  const DELETE_OFFSET_THRESHOLD = -180; // cần kéo card lên khá cao (gần icon) mới xóa
	  const MAX_DELETE_HORIZONTAL_OFFSET = 120; // đảm bảo kéo chủ yếu theo chiều dọc

	  // Motion values for smooth animations
	  const x = useMotionValue(0);
	  const y = useMotionValue(0);
	  // Base scale giữ card nhỏ (gần 226x359) nhưng hơi to hơn một chút cho dễ nhìn.
	  // Khi kéo UP, card thu nhỏ xuống ~50% của base để giống phiên bản mini gần trash icon.
	  const MIN_DRAG_SCALE = BASE_CARD_SCALE * 0.5;
	  const scale = useTransform(y, [DELETE_OFFSET_THRESHOLD, -80, 0, 200], [
	    MIN_DRAG_SCALE, // kéo rất cao (gần/vượt icon) -> nhỏ nhất
	    BASE_CARD_SCALE * 0.7,
	    BASE_CARD_SCALE,
	    BASE_CARD_SCALE,
	  ]);

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

	  const handleDragStart = () => {
	    setIsDraggingCard(true);
	  };

	  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
	    const { offset } = info;

	    // Show delete zone when dragging up (nhẹ) để user thấy icon sớm
	    if (offset.y < -50) {
	      setShowDeleteZone(true);
	      if (currentCard) onDragStart(currentCard.id);

	      // Hiển thị hiệu ứng active khi card đang ở rất gần trash icon
	      const isOver =
	        offset.y < DELETE_OFFSET_THRESHOLD &&
	        Math.abs(offset.x) < MAX_DELETE_HORIZONTAL_OFFSET;
	      setIsOverDeleteIcon(isOver);
	    } else if (offset.y > 50) {
	      // Show stack selector when dragging down
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
	    setIsDraggingCard(false);

	    // Chỉ xóa khi kéo lên cao (gần icon) VÀ gần như kéo thẳng đứng
	    const isDeleteAttempt =
	      showDeleteZone &&
	      offset.y < DELETE_OFFSET_THRESHOLD &&
	      Math.abs(offset.x) < MAX_DELETE_HORIZONTAL_OFFSET;
	    if (isDeleteAttempt && currentCard) {
	      onDelete(currentCard.id);

	      // After deletion, keep the index stable relative to the new list
	      setCurrentIndex((i) => (i >= cards.length - 1 ? 0 : i));

	      // Reset visual state and notify parent
	      setShowDeleteZone(false);
	      setIsOverDeleteIcon(false);
	      onDragEnd();
	      x.set(0);
	      y.set(0);
	      return;
	    }

	    // Handle regular swipe actions - any strong swipe moves card to end of stack
	    if (
	      Math.abs(offset.x) > 150 ||
	      Math.abs(velocity.x) > 500 ||
	      Math.abs(offset.y) > 150
	    ) {
	      // Swiped in any direction (except the delete case above) - move current card to end
	      setCurrentIndex((i) => (i + 1) % cards.length);
	    } else {
	      // Not swiped enough - reset position
	      x.set(0);
	      y.set(0);
	    }

	    // Reset delete zone and notify parent
	    setShowDeleteZone(false);
	    setIsOverDeleteIcon(false);
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
	          initial={{ opacity: 0, y: 20, scale: 0.8 }}
	          animate={{ opacity: 1, y: 0, scale: 1 }}
	          exit={{ opacity: 0, y: 20, scale: 0.8 }}
	          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
	          className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
	        >
	          <div className="relative">
	            {/* Liquid glass glow behind the trash icon */}
	            <motion.div
	              className="absolute inset-0 rounded-full bg-red-400/50 blur-xl"
	              animate={
	                isOverDeleteIcon
	                  ? { scale: [1.1, 1.35, 1.1], opacity: [0.8, 1, 0.8] }
	                  : { scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }
	              }
	              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
	            />
	            {/* Main trash icon with subtle bounce + pulse */}
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

	      {/* Card Stack Preview */}
	      <div className="relative h-[600px] w-full max-w-sm mx-auto flex items-center justify-center">
	        {/* Background cards - stacked like a real deck of cards */}
	        {(() => {
	          const totalBackground = Math.min(4, cards.length - 1);
	          if (totalBackground <= 0) return null;

	          const offsetX = 6; // độ lệch ngang mỗi card (pixel)
	          const offsetY = 8; // độ lệch dọc mỗi card (pixel)
	          const scaleStep = 0.012; // card dưới nhỏ hơn một chút
	          const rotateStep = 1.5; // xoay nhẹ mỗi card (độ)

	          return Array.from({ length: totalBackground }, (_, i) => {
	            const depth = totalBackground - i; // card dưới cùng render trước
	            const cardIndex = (currentIndex + depth) % cards.length;
	            const card = cards[cardIndex];

	            // Card dưới cùng lệch nhiều nhất
	            const translateX = depth * offsetX;
	            const translateY = depth * offsetY;
	            const rotate = depth * rotateStep;
	            const backgroundScale = BASE_CARD_SCALE - depth * scaleStep;
	            const cardOpacity = 1 - depth * 0.08;

	            return (
	              <div
	                key={card.id}
	                className="absolute w-full pointer-events-none"
	                style={{
	                  transform: `translate(${translateX}px, ${translateY}px) scale(${backgroundScale}) rotate(${rotate}deg)`,
	                  opacity: cardOpacity,
	                  transformOrigin: 'center center',
	                  zIndex: 10 - depth,
	                }}
	              >
	                <CardItem card={card} onEdit={() => {}} onDelete={() => {}} />
	              </div>
	            );
	          });
	        })()}

        {/* Current card with drag functionality */}
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
