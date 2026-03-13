import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const toggleVariants = tv({
  base: "inline-flex items-center gap-3 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    checked: {
      true: "text-accent-green",
      false: "text-text-secondary",
    },
  },
});

const trackVariants = tv({
  base: "relative h-[22px] w-[40px] rounded-[11px] p-[3px] transition-colors data-[state=checked]:bg-accent-green data-[state=unchecked]:bg-border-primary",
});

const thumbVariants = tv({
  base: "block h-4 w-4 rounded-full transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-[#0A0A0A] data-[state=unchecked]:bg-[#6B7280]",
});

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  label?: string;
}

export const Toggle = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  ToggleProps
>(({ className, checked, label, ...props }, ref) => {
  return (
    <div className={toggleVariants({ checked, className })}>
      <SwitchPrimitive.Root
        ref={ref}
        checked={checked}
        className={trackVariants({ className })}
        {...props}
      >
        <SwitchPrimitive.Thumb className={thumbVariants()} />
      </SwitchPrimitive.Root>
      {label && <span>{label}</span>}
    </div>
  );
});

Toggle.displayName = "Toggle";
