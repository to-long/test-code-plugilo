type CtaButtonProps = {
  className?: string;
};

export function CtaButton({ className, children }: React.PropsWithChildren<CtaButtonProps>) {
  return (
    <div
      className={`flex items-center justify-center rounded-full w-6 h-6 bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-white shadow-md shadow-violet-500/40 group-hover:shadow-lg group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
