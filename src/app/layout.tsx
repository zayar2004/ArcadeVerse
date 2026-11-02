import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcadeVerse — Online Arcade Platform",
  description: "Next-generation mobile-first online arcade and ticket redemption platform.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070913",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="my">
      <body className="min-h-screen antialiased bg-arcade-dark text-arcade-text flex justify-center selection:bg-arcade-cyan selection:text-black">
        <div className="w-full max-w-md min-h-screen flex flex-col relative pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}
