"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/(auth)/authProvider";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const userRole = user.role.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      ) {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.replace(
            userRole === "manager"
              ? "/managers/properties"
              : "/tenants/favorites"
          );
        }
      } else {
        setIsLoading(false);
      }
    } else {
      // User is not authenticated, redirect to signin
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/signin");
      }
    }
  }, [user, authLoading, router, pathname]);

  if (authLoading || isLoading) return <>Loading...</>;
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-white">
        <Navbar />
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar
              userType={
                user.role.toLowerCase() as "tenant" | "manager"
              }
            />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
