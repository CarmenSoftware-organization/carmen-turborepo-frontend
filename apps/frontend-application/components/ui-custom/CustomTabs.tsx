"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "flex items-center justify-start gap-0 border-b-2 border-border text-muted-foreground w-full flex-nowrap no-scrollbar overflow-x-scroll",
            className,
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            // `mx-2 -mb-[2px] inline-flex text-sm items-center w-fit 
            // justify-start whitespace-nowrap border-x border-t rounded-t-md 
            // px-4 py-2 transition-all first-of-type:ml-0 disabled:pointer-events-none 
            // disabled:text-muted-foreground data-[state=inactive]:border-transparent 
            // data-[state=active]:font-bold data-[state=active]:text-foreground 
            // data-[state=active]:bg-white`,
            `data-[state=active]:border-b-2 data-[state=active]:border-primary px-4 py-2
            text-gray-400 lg:data-[state=active]:text-primary hover:text-gray-500 text-sm
            disabled:text-muted-foreground disabled:cursor-not-allowed disabled:text-gray-300
            data-[state=active]:bg-primary data-[state=active]:text-white rounded-md md:data-[state=active]:bg-white relative -bottom-[2px] text-nowrap 
            `,
            className,
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }