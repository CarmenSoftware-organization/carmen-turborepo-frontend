import React, { ReactNode } from "react";
import SkeltonLoad from "../loading/SkeltonLoad";
import { AnimatePresence } from "../framer-motion/MotionWrapper";

interface Props {
  title: string;
  actionButtons?: ReactNode;
  filters?: ReactNode;
  content: ReactNode;
  bulkActions?: ReactNode;
  isLoading?: boolean;
}

const DataDisplayTemplate: React.FC<Props> = ({
  title,
  actionButtons,
  filters,
  content,
  bulkActions,
  isLoading,
}) => {
  return (
    <div className="flex w-full flex-col justify-center">
      <div className="sticky top-0 bg-background z-10 space-y-1.5 pb-2">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-1.5">
          <div className="text-base font-semibold tracking-tight">
            {title}
          </div>
          {actionButtons && <div>{actionButtons}</div>}
        </div>
        {filters && <div>{filters}</div>}
        {bulkActions && (
          <div className="mb-2">{bulkActions}</div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto bg-background">
        <AnimatePresence mode="wait">{isLoading ? <SkeltonLoad /> : content}</AnimatePresence>
      </div>
    </div>
  );
};

export default DataDisplayTemplate;
