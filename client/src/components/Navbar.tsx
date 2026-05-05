"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/(auth)/authProvider";
import { ChevronDown, ChevronUp, Menu, Plus, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: authUser, refetch } = useGetAuthUserQuery();
  const { user: contextUser, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);



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

  useGSAP(() => {
    if (!isDashboardPage) {
      gsap.from(containerRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, { scope: containerRef });

  if (isDashboardPage) return null;

  return (
    <div
      ref={containerRef}
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
                <span className="text-primary font-black text-[15px] leading-none tracking-tighter uppercase">
                  Chestone Properties
                </span>
                <span className="text-primary/70 font-bold text-[10px] leading-none mt-1 uppercase">
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
        <div className="hidden md:flex items-center justify-center gap-10 font-nav tracking-[1px] text-xs flex-1 px-8">
          {/* The Collection Dropdown */}
          <div className="relative group">
            <Link href="/search" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase block pb-1">
              The Collection
            </Link>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
              <Link href="/search?location=lavington" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Lavington</Link>
              <Link href="/search?location=westlands" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Westlands</Link>
              <Link href="/search?location=kileleshwa" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Kileleshwa</Link>
              <Link href="/search?location=kilimani" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Kilimani</Link>
            </div>
          </div>

          {/* Buy / Rent */}
          <div className="flex gap-3">
            <Link href="/search?type=buy" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">Sale</Link>
            <span className="text-primary/30">/</span>
            <Link href="/search?type=rent" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">Rent</Link>
          </div>


          {/* Structured Solutions Dropdown */}
          <div className="relative group">
            <button className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">
              Structured Solutions
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
              <Link href="/advisory" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Advisory</Link>
              <Link href="/derisking" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Asset De-risking</Link>
              <Link href="/diplomacy" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Diplomacy</Link>
            </div>
          </div>

          {/* About */}
          <Link href="/about" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">
            About
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
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
            <div className="hidden md:flex items-center gap-6 font-nav tracking-[1px]">
              <Link href="/contact-us">
                <Button
                  variant="default"
                  className="bg-secondary text-white hover:bg-secondary/90 font-bold px-6 shadow-sm uppercase text-xs rounded-md"
                >
                  List With Us
                </Button>
              </Link>
            </div>
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
          isMobileMenuOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col py-6 px-8 gap-4 font-nav tracking-[1px] text-xs">
          {/* Mobile The Collection */}
          <div className="flex flex-col">
            <button
              className="flex justify-between items-center text-secondary font-bold uppercase text-[10px] tracking-[2px] py-2"
              onClick={() => setIsCollectionOpen(!isCollectionOpen)}
            >
              Exclusive Areas
              {isCollectionOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <div
              className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${
                isCollectionOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <Link href="/search?location=lavington" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Lavington</Link>
              <Link href="/search?location=westlands" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Westlands</Link>
              <Link href="/search?location=kileleshwa" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Kileleshwa</Link>
              <Link href="/search?location=kilimani" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Kilimani</Link>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-1"></div>
          
          <Link href="/search?type=buy" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link>
          <Link href="/search?type=rent" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link>


          <div className="h-px bg-gray-100 w-full my-1"></div>

          {/* Mobile Solutions */}
          <div className="flex flex-col">
            <button
              className="flex justify-between items-center text-secondary font-bold uppercase text-[10px] tracking-[2px] py-2"
              onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
            >
              Structured Solutions
              {isSolutionsOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <div
              className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${
                isSolutionsOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <Link href="/advisory" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Advisory</Link>
              <Link href="/derisking" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Asset De-risking</Link>
              <Link href="/diplomacy" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Diplomacy</Link>
            </div>
          </div>
          
          <div className="h-px bg-gray-100 w-full my-1"></div>

          <Link href="/about" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          
          {!isLoggedIn && (
            <>
              <div className="h-px bg-gray-100 w-full my-1"></div>
              <div className="flex flex-col gap-4 mt-2">
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-white font-bold uppercase py-6 shadow-lg hover:bg-primary/90 transition-all">
                    List With Us
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
