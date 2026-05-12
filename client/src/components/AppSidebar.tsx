import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  ClipboardCheck,
  FileText,
  Heart,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/authProvider";
import { useGetAuthUserQuery } from "@/state/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  const { signOut, user: contextUser } = useAuth();
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();

  const user = authUser || contextUser;
  const userName = authUser?.userInfo?.name || contextUser?.name || "User";
  const userRole = (authUser?.userRole || contextUser?.role || "User").toUpperCase();

  const navLinks =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/managers/properties" },
          {
            icon: Plus,
            label: "Add New Property",
            href: "/managers/newproperty",
          },
          {
            icon: ClipboardCheck,
            label: "Review Room",
            href: "/managers/review",
          },
          {
            icon: FileText,
            label: "Applications",
            href: "/managers/applications",
          },
          {
            icon: Calendar,
            label: "Viewings",
            href: "/managers/viewings",
          },
          {
            icon: Sparkles,
            label: "Features",
            href: "/managers/features",
          },
          { icon: Settings, label: "Settings", href: "/managers/settings" },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/residences" },
          { icon: Settings, label: "Settings", href: "/tenants/settings" },
        ];

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg border-r border-gray-100"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex min-h-[56px] w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/logo-rentful.png"
                      alt="Rentful"
                      width={120}
                      height={40}
                      className="h-9 w-auto object-contain"
                      priority
                    />
                    <div className="flex flex-col">
                      <span className="text-primary font-black text-[14px] leading-none tracking-tighter">
                        Chestone Properties
                      </span>
                      <span className="text-primary/70 font-bold text-[9px] leading-none tracking-[0.2em] mt-1 uppercase">
                        Structured Properties
                      </span>
                    </div>
                  </Link>
                  <button
                    className="hover:bg-gray-50 p-2 rounded-md transition-colors"
                    onClick={() => toggleSidebar()}
                  >
                    <X className="h-6 w-6 text-primary" />
                  </button>
                </>
              ) : (
                <button
                  className="hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={() => toggleSidebar()}
                >
                  <Image
                    src="/logo-rentful.png"
                    alt="Rentful"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {/* Back to Home Link */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "flex items-center px-7 py-7 transition-all duration-200 text-primary hover:bg-gray-50 hover:text-secondary",
                !open && "ml-[5px]"
              )}
            >
              <Link href="/" className="w-full">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="font-bold tracking-wide uppercase text-xs text-primary">
                    Back to Home
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="px-7 my-4 border-t border-gray-100" />

          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7 transition-all duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-gray-50 hover:text-secondary",
                    !open && "ml-[5px]"
                  )}
                >
                  <Link href={link.href} className="w-full" scroll={false}>
                    <div className="flex items-center gap-3">
                      <link.icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-white" : "text-primary"
                        )}
                      />
                      <span
                        className={cn(
                          "font-bold tracking-wide uppercase text-xs",
                          isActive ? "text-white" : "text-primary"
                        )}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className={cn(
              "flex items-center gap-3",
              open ? "px-3" : "justify-center"
            )}>
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-white font-bold">
                  {userRole[0]}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary truncate">
                    {userName}
                  </p>
                  <p className="text-[10px] font-medium text-primary/60 truncate uppercase tracking-wider">
                    {userRole}
                  </p>
                </div>
              )}
              {open && (
                <button
                  onClick={() => signOut()}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors text-primary/60 hover:text-secondary"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
