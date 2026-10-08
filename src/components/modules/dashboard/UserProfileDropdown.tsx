"use client";

import * as React from "react";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { logoutAction } from "@/src/actions/auth.action";

interface UserProfileDropdownProps {
  initialRole?: string;
  initialEmail?: string;
}

export function UserProfileDropdown({ initialRole = "", initialEmail = "" }: UserProfileDropdownProps) {
  const router = useRouter();

  // Using custom React Query hook to get live profile data from backend
  const { data: userProfile, isLoading, error } = useUserProfile();

  const handleLogout = async () => {
    try {
      await logoutAction();
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const displayName = userProfile?.name || initialEmail.split("@")[0] || "User";
  const displayEmail = userProfile?.email || initialEmail || (error ? "Error fetching profile" : "");
  const displayRole = userProfile?.role || initialRole;
  const profilePhoto = userProfile?.profilePhoto || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 rounded-full transition-colors">
          <Avatar className="h-8 w-8 transition-transform hover:scale-105">
            <AvatarImage src={profilePhoto} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoading ? "Loading..." : displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
            {displayRole && (
              <p className="text-xs font-semibold leading-none text-primary/80 capitalize mt-2">
                {displayRole.toLowerCase()}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
