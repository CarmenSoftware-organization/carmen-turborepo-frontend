import { rowVariants } from "@/utils/ui/animation";
import { motion } from "framer-motion";
interface TableRowMotionProps {
    readonly children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly key?: any;
    readonly index: number;
}

export default function TableRowMotion({ children, index }: TableRowMotionProps) {
    if (!children) {
        console.log("motion item is null");
        return null;
    }
    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            transition={{
                duration: 0.5,
                ease: "easeOut",
                layout: { duration: 0.3 },
                delay: index * 0.08
            }}
            className="border-b border-blue-100 transition-colors hover:bg-blue-50/30 data-[state=selected]:bg-blue-50"
        >
            {children}
        </motion.tr>
    );
}
