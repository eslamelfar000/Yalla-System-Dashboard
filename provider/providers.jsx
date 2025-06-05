"use client";
import { useThemeStore } from "@/store";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { ReactToaster } from "@/components/ui/toaster";
import { Toaster } from "react-hot-toast";
import { SonnToaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

const Providers = ({ children }) => {
  const { theme, radius } = useThemeStore();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="light"
      storageKey="theme-preference"
    >
      <div
        className={cn("dash-tail-app h-full", !isHomePage && `theme-${theme}`)}
        style={!isHomePage ? { "--radius": `${radius}rem` } : undefined}
      >
        {children}
        <ReactToaster />
        <Toaster />
        <SonnToaster />
      </div>
    </ThemeProvider>
  );
};

export default Providers;
