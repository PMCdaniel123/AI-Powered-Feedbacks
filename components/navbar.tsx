import Link from "next/link";
import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";
import { SignedIn } from "@clerk/nextjs";
import ClientSync from "./client-sync";

export default function Navbar() {
  return (
    // <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
    <nav className="border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              AI FEEDBACKS
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />

          <SignedIn>
            <ClientSync />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
