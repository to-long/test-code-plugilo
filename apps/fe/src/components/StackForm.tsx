import { Button } from '@/shared/liquid-glass-components';
import { useState } from 'react';
import type { Stack } from '../types';
import { getRandomColor } from '../services/api';

interface StackFormProps {
  stack?: Stack;
  onSubmit: (data: { name: string; cover: string }) => void;
  onCancel: () => void;
}

const inputClassName = `w-full px-4 py-2.5 text-white text-sm bg-white/5 border border-white/20 backdrop-blur-sm rounded-xl
  shadow-[inset_0_1px_0px_rgba(255,255,255,0.1)] placeholder:text-white/40
  focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300`;

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Cover Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">Cover</label>
        <div
          className="h-32 rounded-xl flex items-center justify-center text-white text-4xl font-bold border border-white/20 shadow-[inset_0_1px_0px_rgba(255,255,255,0.2)]"
          style={{ background: cover }}
        >
          {name.charAt(0) || '?'}
        </div>
        <Button
          type="button"
          onClick={handleRandomColor}
          className="w-full py-2.5"
        >
          🎨 Generate Random Color
        </Button>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white/80">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter stack name"
          required
          className={inputClassName}
        />
      </div>

      {/* Actions - Sticky at bottom */}
      <div className="flex gap-3 pt-4 sticky bottom-0 -mx-6 px-6 -mb-6 pb-6">
        <Button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          highlight="1"
          className="flex-1 py-3"
        >
          {stack ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
