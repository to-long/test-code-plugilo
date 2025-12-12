type DelimiterProps = {
  className?: string;
};

export function Delimiter({ className = '' }: DelimiterProps) {
  return <div className={`h-16 bg-white/20 w-[1px] ${className}`} />;
}
