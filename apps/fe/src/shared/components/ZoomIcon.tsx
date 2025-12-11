import { motion } from 'framer-motion';

type ZoomIconProps = React.PropsWithChildren<{
  className?: string;
}>;

export function ZoomIcon({ children, className }: ZoomIconProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
