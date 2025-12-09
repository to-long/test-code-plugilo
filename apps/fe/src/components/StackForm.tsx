import { useState } from 'react';
import type { Stack } from '../types';
import { getRandomColor } from '../services/api';

interface StackFormProps {
  stack?: Stack;
  onSubmit: (data: { name: string; cover: string }) => void;
  onCancel: () => void;
}

export function StackForm({ stack, onSubmit, onCancel }: StackFormProps) {
  const [name, setName] = useState(stack?.name || '');
  const [cover, setCover] = useState(stack?.cover || getRandomColor());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, cover });
  };

  const handleRandomColor = () => {
    setCover(getRandomColor());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Cover</label>
        <div
          className="h-32 rounded-lg flex items-center justify-center text-white text-4xl font-bold"
          style={{ background: cover }}
        >
          {name.charAt(0) || '?'}
        </div>
        <button
          type="button"
          onClick={handleRandomColor}
          className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          🎨 Generate Random Color
        </button>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter stack name"
          required
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
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
          {stack ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

