import CardCreateSvg from '~/public/icons/card-create.svg?react';
import StackCreateSvg from '~/public/icons/stack-create.svg?react';
import { Button } from './Buttons';
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
          type="button"
          onClick={() => {
            onClose();
            onCreateCard();
          }}
          aria-label="Create a new card - Add a new item to your collection"
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(139,92,246,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <Button
              highlight="1"
              className="w-12 h-12 flex-shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              <CardCreateSvg className="w-6 h-6 text-white" aria-hidden="true" />
            </Button>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                Create Card
              </h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                Add a new item to your collection
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onCreateStack();
          }}
          aria-label="Create a new stack - Organize cards into a new collection"
          className="w-full p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden
            bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/30
            shadow-[inset_0_1px_0px_rgba(255,255,255,0.3)] hover:shadow-[inset_0_1px_0px_rgba(255,255,255,0.5),0_0_20px_rgba(236,72,153,0.2)]"
        >
          <div className="flex items-center gap-4 relative z-10">
            <Button
              highlight="4"
              className="w-12 h-12 flex-shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              <StackCreateSvg className="w-6 h-6 text-white" aria-hidden="true" />
            </Button>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                Create Stack
              </h3>
              <p className="text-sm text-white/60 group-hover:text-white/70 transition-colors">
                Organize cards into a new collection
              </p>
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
}
