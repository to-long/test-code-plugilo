import type { Card } from '../types';

interface CardItemProps {
  card: Card;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function CardItem({ card, onEdit, onDelete, style, className = '' }: CardItemProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-xl overflow-hidden will-change-transform ${className}`}
      style={style}
    >
      {/* Cover Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={card.cover}
          alt={card.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h3>
        {card.description && (
          <p className="text-gray-600 line-clamp-3">{card.description}</p>
        )}
      </div>

      {/* Options Button */}
      <button
        onClick={onEdit}
        className="absolute bottom-6 right-6 w-10 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Card options"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}

