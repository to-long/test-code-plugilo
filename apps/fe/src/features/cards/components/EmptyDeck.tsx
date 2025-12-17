import InboxSvg from '~/public/icons/inbox.svg?react';

export function EmptyDeck() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <InboxSvg className="w-20 h-20 mx-auto mb-4 opacity-60" />
        <p className="text-xl">No cards in this stack</p>
      </div>
    </div>
  );
}
