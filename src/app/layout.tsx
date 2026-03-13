import { JetBrains_Mono } from "next/font/google";
import {
  Navbar,
  NavbarLink,
  NavbarLogo,
  NavbarSpacer,
} from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(jetbrainsMono.className, "antialiased", "bg-bg-page")}
      >
        <Navbar>
          <NavbarLogo>
            <span className="text-[20px] font-bold text-accent-green">
              &gt;
            </span>
            <span className="text-[18px] font-medium text-text-primary">
              devroast
            </span>
          </NavbarLogo>
          <NavbarSpacer />
          <NavbarLink>leaderboard</NavbarLink>
        </Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
