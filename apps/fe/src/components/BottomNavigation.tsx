import type { Stack } from '../types';

interface BottomNavigationProps {
  stacks: Stack[];
  activeStackId: string | null;
  onStackSelect: (stackId: string) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  isDraggingCard: boolean;
  onStackDrop?: (stackId: string) => void;
}

export function BottomNavigation({
  stacks,
  activeStackId,
  onStackSelect,
  onCreateClick,
  onSearchClick,
  isDraggingCard,
  onStackDrop,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Stack List */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {stacks.map((stack) => (
            <button
              key={stack.id}
              onClick={() => onStackSelect(stack.id)}
              onDragOver={(e) => {
                if (isDraggingCard) {
                  e.preventDefault();
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (isDraggingCard && onStackDrop) {
                  onStackDrop(stack.id);
                }
              }}
              className={`flex-shrink-0 relative group ${
                activeStackId === stack.id
                  ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900'
                  : ''
              }`}
            >
              <div
                className="w-16 h-16 rounded-xl overflow-hidden transition-transform group-hover:scale-110"
                style={{ background: stack.cover }}
              >
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs bg-black/20">
                  {stack.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {stack.cardCount}
              </div>
              <div className="text-xs text-center mt-1 text-gray-300 truncate max-w-[64px]">
                {stack.name}
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={onSearchClick}
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-all"
            aria-label="Search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={onCreateClick}
            className="p-4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 transition-all hover:scale-110"
            aria-label="Create"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white transition-all"
            aria-label="Options"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

