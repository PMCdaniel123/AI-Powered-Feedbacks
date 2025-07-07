import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import SidebarConversation from "@/components/sidebar-conversation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GuestProvider } from "@/context/guest-context";

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
            <SidebarProvider>
              <div className="h-screen overflow-hidden">
                <MotionConfig
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 100,
                  }}
                >
                  <GuestProvider>
                    <Navbar />

                    <div className="flex h-[calc(100vh-4rem)]">
                      {/* Sidebar */}
                      <div className="hidden md:block overflow-y-auto">
                        <SidebarConversation />
                      </div>

                      {/* Main page content */}
                      <main className="p-4">
                        <SidebarTrigger />
                        {children}
                      </main>
                    </div>
                  </GuestProvider>
                </MotionConfig>
              </div>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
