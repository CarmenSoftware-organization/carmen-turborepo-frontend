"use client"

import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type CSSProperties,
  type FC
} from "react";

type AccordionContextValue = {
  activeItems: string[];
  toggleItem: (itemId: string) => void;
  isItemActive: (itemId: string) => boolean;
  type: "single" | "multiple";
  collapsible: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const Accordion: FC<AccordionProps> = ({
  className,
  type = "single",
  collapsible = false,
  defaultValue = type === "single" ? "" : [],
  value,
  onValueChange,
  children,
  ...props
}) => {
  // Initialize state based on controlled or uncontrolled mode
  const [activeItems, setActiveItems] = useState<string[]>(() => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        return value;
      }
      return value ? [value] : [];
    }

    if (defaultValue !== undefined) {
      if (Array.isArray(defaultValue)) {
        return defaultValue;
      }
      return defaultValue ? [defaultValue] : [];
    }

    return [];
  });

  // Update state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        setActiveItems(value);
      } else {
        setActiveItems(value ? [value] : []);
      }
    }
  }, [value]);

  const toggleItem = useCallback((itemId: string) => {
    const newActiveItems = (() => {
      if (type === "single") {
        if (activeItems.includes(itemId) && collapsible) {
          return [];
        }
        return [itemId];
      }

      if (activeItems.includes(itemId)) {
        return activeItems.filter(id => id !== itemId);
      } else {
        return [...activeItems, itemId];
      }
    })();

    setActiveItems(newActiveItems);

    if (onValueChange) {
      onValueChange(type === "single" ? newActiveItems[0] || "" : newActiveItems);
    }
  }, [activeItems, type, collapsible, onValueChange]);

  const isItemActive = useCallback((itemId: string) => {
    return activeItems.includes(itemId);
  }, [activeItems]);

  const contextValue = useMemo(() => ({
    activeItems,
    toggleItem,
    isItemActive,
    type,
    collapsible
  }), [activeItems, toggleItem, isItemActive, type, collapsible]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion component");
  }
  return context;
};

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem: FC<AccordionItemProps> = ({
  className,
  value,
  children,
  ...props
}) => {
  const { isItemActive } = useAccordion();
  const isOpen = isItemActive(value);

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      data-value={value}
      className={cn("border-b last:border-b-0", className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const AccordionTrigger: FC<AccordionTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const parentItem = buttonRef.current.closest('[data-value]');
      if (parentItem) {
        const itemValue = parentItem.getAttribute('data-value');
        if (itemValue) {
          setIsOpen(isItemActive(itemValue));
        }
      }
    }
  }, [isItemActive]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const parentItem = e.currentTarget.closest('[data-value]');
    if (parentItem) {
      const value = parentItem.getAttribute('data-value');
      if (value) {
        toggleItem(value);
        setIsOpen(!isOpen);
      }
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <div className="flex">
      <button
        ref={buttonRef}
        type="button"
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={handleClick}
        aria-expanded={isOpen}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
    </div>
  );
};

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AccordionContent: FC<AccordionContentProps> = ({
  className,
  children,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const parentItem = contentRef.current.closest('[data-value]');
      if (parentItem) {
        const isOpenState = parentItem.getAttribute('data-state') === 'open';
        setIsOpen(isOpenState);
        if (isOpenState) {
          setHeight(contentRef.current.scrollHeight);
        } else {
          setHeight(0);
        }
      }
    }

    if (contentRef.current && typeof MutationObserver !== 'undefined') {
      const parentItem = contentRef.current.closest('[data-value]');

      if (parentItem) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'data-state'
            ) {
              const isOpenState = parentItem.getAttribute('data-state') === 'open';
              setIsOpen(isOpenState);

              if (isOpenState && contentRef.current) {
                setHeight(contentRef.current.scrollHeight);
              } else {
                setHeight(0);
              }
            }
          });
        });

        observer.observe(parentItem, {
          attributes: true,
          attributeFilter: ['data-state'],
        });

        return () => {
          observer.disconnect();
        };
      }
    }
  }, []);

  const contentStyles: CSSProperties = {
    height: height !== undefined ? `${height}px` : undefined,
    overflow: 'hidden',
    transition: 'height 0.2s ease-out',
  };

  return (
    <div
      ref={contentRef}
      style={contentStyles}
      data-state={isOpen ? 'open' : 'closed'}
      className={cn("text-sm", className)}
      {...props}
    >
      <div className="pt-0 pb-4">
        {children}
      </div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
