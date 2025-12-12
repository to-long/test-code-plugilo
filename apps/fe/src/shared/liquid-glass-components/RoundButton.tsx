import { type ButtonProps, highlightColors } from './button';

export function RoundButton({ className = '', children, highlight = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center align-middle select-none text-white w-7 h-7 text-sm 
        font-sans font-medium text-center antialiased rounded-full before:rounded-full after:rounded-full
        transition-all duration-300 bg-white/5 hover:bg-white/20
        ${highlightColors[highlight]}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
