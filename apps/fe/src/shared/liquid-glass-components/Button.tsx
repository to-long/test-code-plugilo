import { liquidGlass } from './effects';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  highlight?: '1' | '2' | '3' | '4' | '5' | '';
};

export function Button({ className, children, highlight = '', ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center align-middle select-none px-4 py-2 text-white text-sm rounded-lg 
        font-sans font-medium text-center antialiased rounded-lg before:rounded-lg after:rounded-lg
        ${liquidGlass}
        ${highlightColors[highlight]}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const highlightColors = {
  '1': 'bg-gradient-to-br from-violet-500/40 to-fuchsia-600/40',
  '2': 'bg-gradient-to-br from-blue-500/40 to-cyan-600/40',
  '3': 'bg-gradient-to-br from-green-500/40 to-lime-600/40',
  '4': 'bg-gradient-to-br from-red-500/40 to-pink-600/40',
  '5': 'bg-gradient-to-br from-yellow-500/40 to-orange-600/40',
  '': '',
};
