import { motion } from 'framer-motion';

type RotateIconProps = React.PropsWithChildren<{
  className?: string;
}>;

export function RotateIcon({ children, className }: RotateIconProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ rotate: 180 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
