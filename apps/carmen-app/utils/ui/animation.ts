/**
 * Framer Motion animation variants
 * Reusable animation configurations for consistent UI animations
 */

/**
 * Simple fade in/out animation
 * @example
 * <motion.div variants={fadeVariants} initial="hidden" animate="visible">
 */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Slide up with fade animation
 * @example
 * <motion.div variants={slideUpVariants} initial="hidden" animate="visible">
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Button interaction states
 * @example
 * <motion.button variants={buttonVariants} initial="idle" whileHover="hover" whileTap="tap">
 */
export const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * Table cell content animation with delay
 * @example
 * <motion.div variants={cellContentVariants} initial="hidden" animate="visible">
 */
export const cellContentVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
  },
};

/**
 * Table row animation with enter/exit states
 * @example
 * <motion.tr variants={rowVariants} initial="hidden" animate="visible" exit="exit">
 */
export const rowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
};
