"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/(auth)/authProvider";
import { Bell, Menu, MessageCircle, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser, refetch } = useGetAuthUserQuery();
  const { user: contextUser, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/search", label: "Listings" },
  ];

  // Refetch RTK Query when auth context user changes (e.g., after login)
  React.useEffect(() => {
    if (contextUser && !authUser) {
      refetch();
    }
  }, [contextUser, authUser, refetch]);

  // Use auth context as fallback for immediate logged-in state
  const isLoggedIn = !!authUser || !!contextUser;
  const userRole = authUser?.userRole || contextUser?.role;
  const userName = authUser?.userInfo?.name || contextUser?.name;

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-4 px-8 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer transition-transform hover:scale-105"
            scroll={false}
          >
            <div className="flex items-center gap-4">
              <Image
                src="/logo-rentful.png"
                alt="Chestone Properties Logo"
                width={160}
                height={160}
                className="h-16 w-auto object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="text-primary font-black text-3xl leading-none tracking-tighter">
                  Chestone Properties
                </span>
                <span className="text-primary/70 font-bold text-sm leading-none tracking-[0.4em] mt-1 uppercase">
                  Structured Property Solutions
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && isLoggedIn && (
            <Button
              variant="secondary"
              className="md:ml-4 bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
              onClick={() =>
                router.push(
                  userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-primary hover:text-secondary transition-colors duration-300 group font-semibold uppercase text-sm tracking-wider"
            >
              {link.label}
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <div className="relative hidden md:block group">
                <MessageCircle className="w-5 h-5 cursor-pointer text-primary group-hover:text-secondary transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
              </div>
              <div className="relative hidden md:block group">
                <Bell className="w-5 h-5 cursor-pointer text-primary group-hover:text-secondary transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none group">
                  <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-secondary transition-all">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-secondary font-bold">
                      {(userRole?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary font-bold text-sm hidden md:block group-hover:text-secondary transition-colors">
                    {userName}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary border-gray-100 shadow-xl mt-2 w-48">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary hover:!text-white font-bold p-3"
                    onClick={() =>
                      router.push(
                        userRole?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites",
                        { scroll: false }
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary hover:!text-secondary p-3"
                    onClick={() =>
                      router.push(
                        `/${userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary hover:!text-secondary p-3"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-primary font-bold hover:text-secondary hover:bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  className="bg-primary text-white hover:bg-primary/90 font-bold px-6 shadow-sm"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center text-primary hover:text-secondary focus:outline-none transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col py-6 px-8 gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary hover:text-secondary transition-colors duration-300 font-bold uppercase text-sm tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-gray-100 w-full my-1"></div>
          {!isLoggedIn && (
            <div className="flex flex-col gap-3">
              <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <p className="text-primary font-bold py-2">Sign In</p>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-secondary font-bold">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
