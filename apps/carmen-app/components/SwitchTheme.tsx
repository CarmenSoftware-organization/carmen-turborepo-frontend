"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, MotionDiv } from "./framer-motion/MotionWrapper";

export function SwitchTheme() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <Button
      variant={"outline"}
      onClick={handleClick}
      data-id="switch-theme-button"
      className="cursor-pointer w-7 h-7 relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <MotionDiv
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4" />
          </MotionDiv>
        ) : (
          <MotionDiv
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4" />
          </MotionDiv>
        )}
      </AnimatePresence>
    </Button>
  );
}
