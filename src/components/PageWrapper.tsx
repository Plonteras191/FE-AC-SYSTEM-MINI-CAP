import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const pageVariants = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  in: {
    scale: 1,
    opacity: 1,
  },
  out: {
    scale: 1.05,
    opacity: 0,
  },
};

const pageTransition = {
  duration: 0.5,
  ease: "easeInOut" as const,
};

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;