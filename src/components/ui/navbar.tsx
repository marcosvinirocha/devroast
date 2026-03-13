import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const navbarVariants = tv({
  base: "flex h-14 w-full items-center gap-2 bg-bg-page px-6 border-b border-border-primary",
});

const logoVariants = tv({
  base: "flex items-center gap-2",
});

const spacerVariants = tv({
  base: "h-full w-px bg-border-primary mx-4",
});

const linkVariants = tv({
  base: "font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer",
});

export interface NavbarProps extends HTMLAttributes<HTMLDivElement> {}

export interface NavbarLogoProps extends HTMLAttributes<HTMLDivElement> {}

export interface NavbarSpacerProps extends HTMLAttributes<HTMLDivElement> {}

export interface NavbarLinkProps extends HTMLAttributes<HTMLAnchorElement> {}

export const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav className={navbarVariants({ className })} ref={ref} {...props}>
        {children}
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";

export const NavbarLogo = forwardRef<HTMLDivElement, NavbarLogoProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={logoVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

NavbarLogo.displayName = "NavbarLogo";

export const NavbarSpacer = forwardRef<HTMLDivElement, NavbarSpacerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={spacerVariants({ className })} ref={ref} {...props} />
    );
  },
);

NavbarSpacer.displayName = "NavbarSpacer";

export const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a className={linkVariants({ className })} ref={ref} {...props}>
        {children}
      </a>
    );
  },
);

NavbarLink.displayName = "NavbarLink";
