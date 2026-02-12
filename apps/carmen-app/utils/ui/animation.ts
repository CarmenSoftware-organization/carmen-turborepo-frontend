export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const cellContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
};

export const rowVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
