import MagnifierSvg from '~/public/icons/magnifier.svg?react';
import PlusSvg from '~/public/icons/plus.svg?react';

export function Search() {
  return (
    <div className="relative w-80">
      <input
        type="text"
        placeholder="Search anything..."
        className="pl-8 pr-12 py-1 w-full text-white text-sm bg-black/20 border border-white/50 backdrop-blur-sm rounded-full shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] placeholder:text-white/70 focus:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 before:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
        <MagnifierSvg className="w-4 h-4" />
      </div>
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
      >
        <PlusSvg className="w-4 h-4 rotate-45" />
      </button>
    </div>
  );
}
