'use client';

import { useTheme } from "@/contexts";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <Sun className="size-9 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-9 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}