import { useState } from 'react';
import type { Card, Stack } from '../types';
import { getPlaceholderImage } from '../services/api';

interface CardFormProps {
  card?: Card;
  stacks: Stack[];
  onSubmit: (data: { name: string; description: string; cover: string; stackId: string }) => void;
  onCancel: () => void;
}

export function CardForm({ card, stacks, onSubmit, onCancel }: CardFormProps) {
  const [name, setName] = useState(card?.name || '');
  const [description, setDescription] = useState(card?.description || '');
  const [cover, setCover] = useState(card?.cover || '');
  const [stackId, setStackId] = useState(card?.stackId || stacks[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !stackId) return;

    const finalCover = cover || getPlaceholderImage(name);
    onSubmit({ name, description, cover: finalCover, stackId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Cover Image</label>
        <div className="relative h-48 bg-slate-700 rounded-lg overflow-hidden">
          {cover || name ? (
            <img
              src={cover || getPlaceholderImage(name)}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <input
          type="url"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          placeholder="Enter image URL (optional - will auto-generate if empty)"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter card name"
          required
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          rows={3}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
      </div>

      {/* Stack Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Stack *</label>
        <select
          value={stackId}
          onChange={(e) => setStackId(e.target.value)}
          required
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {stacks.map((stack) => (
            <option key={stack.id} value={stack.id}>
              {stack.name} ({stack.cardCount} cards)
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-lg font-medium transition-all"
        >
          {card ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

