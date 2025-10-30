import React, { ReactNode } from "react";
import SkeltonLoad from "../loading/SkeltonLoad";
import { MotionDiv, AnimatePresence } from "../framer-motion/MotionWrapper";

interface Props {
  title: string;
  actionButtons?: ReactNode;
  filters?: ReactNode;
  content: ReactNode;
  bulkActions?: ReactNode;
  isLoading?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const DataDisplayTemplate: React.FC<Props> = ({
  title,
  actionButtons,
  filters,
  content,
  bulkActions,
  isLoading,
}) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-4 flex w-full flex-col justify-center transition-all duration-300 ease-in-out`}
    >
      <MotionDiv
        className="sticky top-0 bg-background z-10 space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MotionDiv className="md:flex justify-between items-start" {...fadeIn}>
          <MotionDiv className="text-2xl font-bold tracking-wide" {...fadeInUp}>
            {/* @ts-ignore - Type conflict between React 19 RC and framer-motion */}
            {title}
          </MotionDiv>
          {actionButtons && (
            <MotionDiv className="mt-4 md:mt-0" {...fadeInUp}>
              {/* @ts-ignore - Type conflict between React 19 RC and framer-motion */}
              {actionButtons}
            </MotionDiv>
          )}
        </MotionDiv>
        <AnimatePresence>
          {filters && (
            <MotionDiv {...fadeIn}>
              {/* @ts-ignore - Type conflict between React 19 RC and framer-motion */}
              {filters}
            </MotionDiv>
          )}
          {bulkActions && (
            <MotionDiv className="mb-4" {...fadeIn}>
              {/* @ts-ignore - Type conflict between React 19 RC and framer-motion */}
              {bulkActions}
            </MotionDiv>
          )}
        </AnimatePresence>
      </MotionDiv>
      <MotionDiv className="flex-1 overflow-y-auto bg-background" {...fadeInUp}>
        {/* @ts-ignore - Type conflict between React 19 RC and framer-motion */}
        <AnimatePresence mode="wait">{isLoading ? <SkeltonLoad /> : content}</AnimatePresence>
      </MotionDiv>
    </MotionDiv>
  );
};

export default DataDisplayTemplate;
