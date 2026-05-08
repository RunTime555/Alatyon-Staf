"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockPatient } from "@/lib/mock-data";

export function Header({ title }) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 w-full">
      <div className="flex items-center gap-4">
        <div className="w-10 lg:hidden" />
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{mockPatient.fullName}</p>
            <p className="text-xs text-muted-foreground">ID: #{mockPatient.mrn}</p>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src={mockPatient.avatar} alt={mockPatient.fullName} />
            <AvatarFallback>{mockPatient.firstName[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}