"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check if user is logged in by looking for accessToken in localStorage
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    
    // Optional: Listen for storage events if they login/logout in another tab
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    // Exact match for Home, startswith for others like /doctors, /doctors/123
    const isActive = path === "/" ? pathname === path : pathname.startsWith(path);
    
    return `text-sm font-semibold transition-all duration-300 ${
      isActive 
        ? "text-blue-600 dark:text-blue-500 border-b-2 border-blue-600 dark:border-blue-500 pb-1" 
        : "text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-500"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Activity className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
            HealthCare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium mt-1">
          <Link href="/" className={getLinkClasses("/")}>
            Home
          </Link>
          <Link href="/doctors" className={getLinkClasses("/doctors")}>
            Find Doctors
          </Link>
          <Link href="/services" className={getLinkClasses("/services")}>
            Services
          </Link>
          <Link href="/contact" className={getLinkClasses("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="rounded-full px-6 shadow-md transition-transform hover:scale-105">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-6 shadow-md transition-transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className={`text-lg font-semibold transition-colors ${
                    pathname === "/" ? "text-blue-600 dark:text-blue-500" : "hover:text-blue-600 dark:hover:text-blue-500"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/doctors"
                  className={`text-lg font-semibold transition-colors ${
                    pathname.startsWith("/doctors") ? "text-blue-600 dark:text-blue-500" : "hover:text-blue-600 dark:hover:text-blue-500"
                  }`}
                >
                  Find Doctors
                </Link>
                <Link
                  href="/services"
                  className={`text-lg font-semibold transition-colors ${
                    pathname.startsWith("/services") ? "text-blue-600 dark:text-blue-500" : "hover:text-blue-600 dark:hover:text-blue-500"
                  }`}
                >
                  Services
                </Link>
                <div className="flex flex-col gap-4 mt-6 border-t pt-6">
                  {isLoggedIn ? (
                    <Link href="/dashboard" className="w-full">
                      <Button className="w-full justify-center rounded-full">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full justify-center">
                          Sign in
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full justify-center rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
