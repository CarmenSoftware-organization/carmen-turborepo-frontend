import * as React from "react";
import { cn } from "@/lib/utils";

type GapSize = number | "small" | "middle" | "large";
type Justify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";
type Align =
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "baseline";

type ResponsiveValue<T> = T | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl", T>>;

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    readonly vertical?: ResponsiveValue<boolean>;
    readonly justify?: ResponsiveValue<Justify>;
    readonly align?: ResponsiveValue<Align>;
    readonly gap?: ResponsiveValue<GapSize>;
    readonly wrap?: ResponsiveValue<boolean>;
}

const gapMap: Record<string, string> = {
    small: "gap-2",
    middle: "gap-4",
    large: "gap-6",
};

const breakpointPrefix: Record<string, string> = {
    xs: "",
    sm: "sm:",
    md: "md:",
    lg: "lg:",
    xl: "xl:",
};

const getResponsiveClasses = <T,>(
    prop: ResponsiveValue<T> | undefined,
    mapFn: (value: T) => string
): string => {
    if (prop == null) return "";
    if (typeof prop !== "object") {
        return mapFn(prop);
    }

    return Object.entries(prop)
        .map(([bp, value]) => {
            const prefix = breakpointPrefix[bp] || "";
            return `${prefix}${mapFn(value)}`;
        })
        .join(" ");
};


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
                getResponsiveClasses(vertical, (v) => (v ? "flex-col" : "flex-row")),
                getResponsiveClasses(wrap, (v) => (v ? "flex-wrap" : "flex-nowrap")),
                getResponsiveClasses(justify, (j) => `justify-${j}`),
                getResponsiveClasses(align, (a) => `items-${a}`),
                getResponsiveClasses(gap, (g) =>
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
