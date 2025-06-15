"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoadingButton = ({
  children,
  loading,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  return (
    <Button
      disabled={loading}
      variant={variant}
      size={size}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
