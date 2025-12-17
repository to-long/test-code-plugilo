import { StackItem } from '@/features/stacks/components/StackItem';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import LogoSvg from '~/public/icons/logo.svg?react';
import StarSvg from '~/public/icons/star.svg?react';

export const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  const switchTheme = useCallback(() => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove(currentTheme);
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem('theme', nextTheme);
  }, []);

  return (
    <div
      className="border-r border-white/15 pe-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StackItem
        onClick={switchTheme}
        name={<LogoSvg className="w-12" aria-label="Plugilo logo" />}
        cover={
          <motion.div
            animate={
              isHovered
                ? {
                    y: [0, -8, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'loop',
                      duration: 0.8,
                      ease: 'easeInOut',
                    },
                  }
                : { y: 0 }
            }
            className="text-white dark:text-black"
          >
            <StarSvg className="w-4 h-4" aria-hidden="true" />
          </motion.div>
        }
        aria-label="Plugilo home"
      />
    </div>
  );
};
