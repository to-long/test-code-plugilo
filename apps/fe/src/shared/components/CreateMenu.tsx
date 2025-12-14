import { Button } from '@/shared/liquid-glass-components';
import { Modal } from './Modal';

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: () => void;
  onCreateStack: () => void;
}

export function CreateMenu({ isOpen, onClose, onCreateCard, onCreateStack }: CreateMenuProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New">
      <div className="space-y-4">
        <button
          onClick={() => {
            onClose();
            onCreateCard();
          }}
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(139,92,246,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <Button highlight="1" className="w-12 h-12 flex-shrink-0 pointer-events-none">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </Button>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">Create Card</h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">Add a new item to your collection</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            onClose();
            onCreateStack();
          }}
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(236,72,153,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <Button highlight="4" className="w-12 h-12 flex-shrink-0 pointer-events-none">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </Button>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">Create Stack</h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">Organize cards into a new collection</p>
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
}

