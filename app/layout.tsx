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
                <main className="py-8">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="hidden lg:block lg:col-span-3">
                        <SidebarConversation />
                      </div>
                      <div className="lg:col-span-9">{children}</div>
                    </div>
                  </div>
                </main>
              </MotionConfig>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
