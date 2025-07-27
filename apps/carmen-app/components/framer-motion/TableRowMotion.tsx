import { motion } from "framer-motion";
import { fadeVariants } from "@/utils/framer-variants";

const rowVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    exit: {
        opacity: 0,
        x: -50,
        scale: 0.95
    }
};

interface TableRowMotionProps {
    readonly children: React.ReactNode;
    readonly key: any;
    readonly index: number;
}

export default function TableRowMotion({ children, key, index }: TableRowMotionProps) {
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
