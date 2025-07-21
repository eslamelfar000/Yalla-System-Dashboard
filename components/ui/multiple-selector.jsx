"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

const MultipleSelector = React.forwardRef(
  (
    {
      value = [],
      onValueChange,
      placeholder = "Select options...",
      options = [],
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (item) => {
      onValueChange(value.filter((i) => i !== item));
    };

    const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && value.length > 0) {
              onValueChange(value.slice(0, -1));
            }
          }
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [value, onValueChange]
    );

    const selectables = options.filter(
      (option) => !value.includes(option.value)
    );

    return (
      <Command
        onKeyDown={handleKeyDown}
        className={`overflow-visible bg-transparent ${className}`}
        {...props}
      >
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1">
          <div className="flex gap-1 flex-wrap">
            {value.map((item) => {
              const option = options.find((opt) => opt.value === item);
              return (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {option?.label || item}
                  <button
                    className="ml-3 ring-offset-background rounded-full outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-white hover:text-red-500" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              disabled={disabled}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onValueChange([...value, option.value]);
                      }}
                      className={"cursor-pointer"}
                      disabled={disabled}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";

export { MultipleSelector };
export { default as Option } from "./select.jsx";
