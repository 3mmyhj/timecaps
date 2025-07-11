"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hourglass, LogOut, PlusCircle, ImagePlus } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [avatarUrl, setAvatarUrl] = React.useState("https://placehold.co/100x100.png");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setAvatarUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 text-xl font-bold font-headline text-primary-foreground hover:opacity-90 transition-opacity">
              <div className="bg-primary p-2 rounded-lg">
                <Hourglass className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block">ChronoLog</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/dashboard/new">
                  <PlusCircle />
                  <span className="hidden sm:inline-block">New Capsule</span>
                </Link>
              </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl} alt="User avatar" data-ai-hint="user avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleUploadClick} className="cursor-pointer">
                     <ImagePlus className="mr-2 h-4 w-4" />
                     <span>Change Photo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                     <Link href="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background">
        {children}
      </main>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
