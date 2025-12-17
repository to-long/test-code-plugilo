import InboxSvg from '~/public/icons/inbox.svg?react';

export function EmptyDeck() {
  return (
    <div className="relative h-[600px] w-full max-w-sm mx-auto flex items-center justify-center text-gray-500">
      <div className="text-center">
        <InboxSvg className="w-20 h-20 mx-auto mb-4 opacity-60" />
        <p className="text-xl">No cards in this stack</p>
      </div>
    </div>
  );
}
