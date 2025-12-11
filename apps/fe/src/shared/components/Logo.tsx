import { motion } from 'framer-motion';
import LogoImage from '~/public/icons/logo.svg?react';
import StarImgage from '~/public/icons/star.svg?react';

type LogoProps = {
  collapse?: boolean;
  className?: string;
};
export function Logo({ collapse = false, className }: LogoProps) {
  return (
    <div className={`gap-2 ${className}`}>
      {!collapse && (
        <motion.div
          className="w-8 h-8"
          whileHover={{ rotate: 360, scale: 1.3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
            <StarImgage fill="white" width={24} height={24} />
          </div>
        </motion.div>
      )}

      <div className="w-12" style={{ color: '#f3f3f7' }}>
        <LogoImage />
      </div>
    </div>
  );
}
