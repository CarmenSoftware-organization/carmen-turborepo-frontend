import { motion } from "framer-motion";
import { fadeVariants } from "@/utils/framer-variants";

interface TableRowMotionProps {
    readonly children: React.ReactNode;
    readonly index: number;
    readonly classNames?: string;
}

export default function TableRowMotion({ children, index, classNames }: TableRowMotionProps) {
    if (!children) {
        console.log("motion item is null");
        return null;
    }
    return (
        <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
            }}
            className={classNames}
        >
            {children}
        </motion.div>
    );
}
