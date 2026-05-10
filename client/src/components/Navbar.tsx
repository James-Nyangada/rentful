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
  const [isWhyChooseOpen, setIsWhyChooseOpen] = useState(false);



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
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (!isDashboardPage) {
        gsap.from(containerRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    });
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
          <div className="flex items-center gap-1.2 md:gap-2">
            <Image
              src="/logo-rentful.png"
              alt="Chestone Properties Logo"
              width={160}
              height={160}
              className="h-14 md:h-16 w-auto object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-primary font-heading font-black text-[24px] md:text-[22px] leading-none tracking-tighter uppercase">
                Chestone Properties
              </span>
              <span className="text-primary/70 font-bold text-[10px] md:text-[9px] leading-none mt-1 uppercase tracking-[0.1em]">
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
          <Link href="/" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">Home</Link>
          <Link href="/search?type=buy" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">Buy</Link>
          <Link href="/search?type=rent" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">Rent</Link>

          {/* Exclusive Areas Dropdown */}
          <div className="relative group">
            <Link href="/exclusive-areas" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase block pb-1">
              Exclusive Areas
            </Link>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
              <Link href="/search?location=Kilimani" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Kilimani</Link>
              <Link href="/search?location=Kileleshwa" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Kileleshwa</Link>
              <Link href="/search?location=Westlands" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Westlands</Link>
              <Link href="/search?location=Lavington" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Lavington</Link>
              <Link href="/search?location=Karen" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Karen</Link>
              <Link href="/search?location=Riverside Drive" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Riverside Drive</Link>
            </div>
          </div>

          <Link href="/#testimonials" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase">
            Testimonials
          </Link>

          {/* Why Choose Chestone Dropdown */}
          <div className="relative group">
            <Link href="/exclusive-areas" className="text-primary hover:text-secondary transition-colors duration-300 font-semibold uppercase block pb-1">
              Why Choose Us
            </Link>
            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
              <Link href="/exclusive-areas" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Exclusive Areas</Link>
              <Link href="/about" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">About Us</Link>
              <Link href="/#testimonials" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Testimonials</Link>
              <Link href="/contact-us" className="px-4 py-2 text-primary hover:bg-primary hover:text-white transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
            <div className="hidden md:block">
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
            </div>
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
          <Link href="/" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/search?type=buy" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link>
          <Link href="/search?type=rent" className="text-primary font-bold uppercase py-2" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link>

          <div className="h-px bg-gray-100 w-full my-1"></div>

          {/* Mobile Exclusive Areas */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <Link 
                href="/exclusive-areas" 
                className="text-secondary font-bold uppercase text-[10px] tracking-[2px] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exclusive Areas
              </Link>
              <button
                className="text-secondary p-2"
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
              >
                {isCollectionOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
            <div
              className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${
                isCollectionOpen ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <Link href="/search?location=Kilimani" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Kilimani</Link>
              <Link href="/search?location=Kileleshwa" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Kileleshwa</Link>
              <Link href="/search?location=Westlands" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Westlands</Link>
              <Link href="/search?location=Lavington" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Lavington</Link>
              <Link href="/search?location=Karen" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Karen</Link>
              <Link href="/search?location=Riverside Drive" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Riverside Drive</Link>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full my-1"></div>

          {/* Mobile Testimonials */}
          <Link 
            href="/#testimonials" 
            className="flex justify-between items-center text-secondary font-bold uppercase text-[10px] tracking-[2px] py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Testimonials
          </Link>

          <div className="h-px bg-gray-100 w-full my-1"></div>

          {/* Mobile Why Choose Chestone */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <Link 
                href="/exclusive-areas" 
                className="text-secondary font-bold uppercase text-[10px] tracking-[2px] py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Why Choose Us
              </Link>
              <button
                className="text-secondary p-2"
                onClick={() => setIsWhyChooseOpen(!isWhyChooseOpen)}
              >
                {isWhyChooseOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
            <div
              className={`flex flex-col gap-3 pl-4 overflow-hidden transition-all duration-300 ${
                isWhyChooseOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <Link href="/exclusive-areas" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Exclusive Areas</Link>
              <Link href="/about" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/#testimonials" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link>
              <Link href="/contact-us" className="text-primary font-bold uppercase py-1" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            </div>
          </div>
          
          {isLoggedIn ? (
            <>
              <div className="h-px bg-gray-100 w-full my-1"></div>
              <div className="flex items-center gap-4 py-4">
                <Avatar className="h-12 w-12 border-2 border-secondary shadow-sm">
                  <AvatarFallback className="bg-primary text-secondary font-bold text-xl">
                    {(userRole?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-primary font-black text-base uppercase tracking-tighter">
                    {userName}
                  </p>
                  <p className="text-secondary font-bold text-[10px] uppercase tracking-widest">
                    {userRole} Account
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link 
                  href={userRole?.toLowerCase() === "manager" ? "/managers/properties" : "/tenants/favorites"} 
                  className="text-primary font-bold uppercase py-3 border-b border-gray-50 flex justify-between items-center" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Go to Dashboard
                  <ChevronDown className="w-4 h-4 -rotate-90 text-gray-300" />
                </Link>
                <Link 
                  href={`/${userRole?.toLowerCase()}s/settings`} 
                  className="text-primary font-bold uppercase py-3 border-b border-gray-50 flex justify-between items-center" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                  <ChevronDown className="w-4 h-4 -rotate-90 text-gray-300" />
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-red-500 font-black uppercase py-4 text-left tracking-widest text-[10px]"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="h-px bg-gray-100 w-full my-1"></div>
              <div className="flex flex-col gap-4 mt-2">
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-secondary text-white font-bold uppercase py-6 shadow-lg hover:bg-secondary/90 transition-all">
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
