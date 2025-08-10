import * as React from "react";
import { cn } from "@/lib/utils";

type GapSize = number | "small" | "middle" | "large";
type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";
type Align = "start" | "center" | "end" | "stretch" | "baseline";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly vertical?: Responsive<boolean>;
    readonly justify?: Responsive<Justify>;
    readonly align?: Responsive<Align>;
    readonly gap?: Responsive<GapSize>;
    readonly wrap?: Responsive<boolean>;
}

const gapMap: Record<string, string> = {
    small: "gap-2",
    middle: "gap-4",
    large: "gap-6",
};

const bp: Record<Breakpoint, string> = {
    xs: "",
    sm: "sm:",
    md: "md:",
    lg: "lg:",
    xl: "xl:",
};

function addResponsive<T>(
    prop: Responsive<T> | undefined,
    fn: (value: T) => string
): string[] {
    const out: string[] = [];
    if (prop == null) return out;

    if (typeof prop !== "object") {
        out.push(fn(prop));
    } else {
        if ("xs" in prop && prop.xs !== undefined) out.push(fn(prop.xs as T));
        if ("sm" in prop && prop.sm !== undefined) out.push(bp.sm + fn(prop.sm as T));
        if ("md" in prop && prop.md !== undefined) out.push(bp.md + fn(prop.md as T));
        if ("lg" in prop && prop.lg !== undefined) out.push(bp.lg + fn(prop.lg as T));
        if ("xl" in prop && prop.xl !== undefined) out.push(bp.xl + fn(prop.xl as T));
    }
    return out;
}

export default function Flex({
    vertical = false,
    justify = "start",
    align = "stretch",
    gap = 0,
    wrap = false,
    className,
    children,
    ...props
}: FlexProps) {
    return (
        <div
            className={cn(
                "flex",
                addResponsive(vertical, (v) => (v ? "flex-col" : "flex-row")),
                addResponsive(wrap, (v) => (v ? "flex-wrap" : "flex-nowrap")),
                addResponsive(justify, (j) => `justify-${j}`),
                addResponsive(align, (a) => `items-${a}`),
                addResponsive(gap, (g) =>
                    typeof g === "number" ? `gap-[${g}px]` : gapMap[g] || ""
                ),
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
