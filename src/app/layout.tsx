import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Navbar, NavbarSpacer } from "@/components/ui/navbar";
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
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-accent-green">
              &gt;
            </span>
            <span className="text-[18px] font-medium text-text-primary">
              devroast
            </span>
          </Link>
          <NavbarSpacer />
          <Link
            href="/leaderboard"
            className="font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            leaderboard
          </Link>
        </Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
