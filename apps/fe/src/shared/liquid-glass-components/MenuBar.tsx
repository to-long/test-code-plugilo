import { liquidGlassBase } from './effects';

type MenuBarProps = React.HTMLAttributes<HTMLDivElement>;

export function MenuBar({ className, children, ...props }: React.PropsWithChildren<MenuBarProps>) {
  return (
    <div
      className={`${liquidGlassBase} inline-flex items-center justify-center align-middle select-none px-6 pt-3 pb-1 text-white text-sm gap-4 
      rounded-3xl before:rounded-3xl after:rounded-3xl 
      ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
