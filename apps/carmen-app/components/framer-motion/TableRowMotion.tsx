import { rowVariants } from "@/utils/ui/animation";
import { motion } from "framer-motion";
interface TableRowMotionProps {
    readonly children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly key?: any;
    readonly index: number;
}

export default function TableRowMotion({ children }: TableRowMotionProps) {
    if (!children) {
        return null;
    }
    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
        >
            {children}
        </motion.tr>
    );
}
