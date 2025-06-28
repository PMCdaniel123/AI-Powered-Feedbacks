import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import SidebarConversation from "@/components/sidebar-conversation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Feedback App",
  description: "Submit your feedback and let AI help!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              <MotionConfig
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                }}
              >
                <Navbar />

                <div className="flex">
                  {/* Sidebar */}
                  <div className="hidden md:block w-64 border-r bg-white">
                    <SidebarConversation />
                  </div>

                  {/* Main page content */}
                  <main className="flex-1 min-h-screen p-4">{children}</main>
                </div>
              </MotionConfig>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
