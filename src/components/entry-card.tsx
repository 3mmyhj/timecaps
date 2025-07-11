
"use client";

import Image from "next/image";
import { useState } from "react";
import { format, isFuture } from "date-fns";
import { Lock, Unlock, Calendar, Sparkles } from "lucide-react";
import type { JournalEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type EntryCardProps = {
  entry: JournalEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLocked = isFuture(entry.unlockDate);
  const unlockDateFormatted = format(entry.unlockDate, "PPP");
  const createdAtFormatted = format(entry.createdAt, "PPP");

  if (isLocked) {
    return (
       <Card className="flex flex-col justify-center items-center text-center p-6 overflow-hidden bg-card/50 border-dashed relative h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5 opacity-50"></div>
        <div className="z-10">
          <div className="flex justify-center mb-4">
            <Lock className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-xl font-headline text-foreground mb-2">{entry.title}</CardTitle>
          <p className="text-sm text-muted-foreground">Unlocks on {unlockDateFormatted}</p>
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full cursor-pointer hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
          <div className="relative">
            {entry.imageUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={entry.imageHint || 'journal photo'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <CardHeader className={entry.imageUrl ? "absolute bottom-0 w-full text-white" : ""}>
              <CardTitle className="font-headline">{entry.title}</CardTitle>
              {!entry.imageUrl && <CardDescription>Unlocked on {unlockDateFormatted}</CardDescription>}
            </CardHeader>
          </div>
          <CardContent className="pt-6">
             <p className="text-muted-foreground line-clamp-3">{entry.content}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button variant="secondary" className="w-full">
              <Unlock className="mr-2 h-4 w-4" />
              Open Capsule
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <Badge variant="outline" className="w-fit mb-2 border-accent text-accent">
            <Sparkles className="mr-2 h-3 w-3" />
            Memory Unlocked
          </Badge>
          <DialogTitle className="text-3xl font-headline">{entry.title}</DialogTitle>
          <DialogDescription>
            Unlocked on {unlockDateFormatted} &bull; Originally created on {createdAtFormatted}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {entry.imageUrl && (
              <div className="relative h-64 w-full rounded-md overflow-hidden">
                <Image
                  src={entry.imageUrl}
                  alt={entry.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={entry.imageHint || 'journal photo'}
                />
              </div>
            )}
            <p className="text-foreground/90 whitespace-pre-wrap">{entry.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
