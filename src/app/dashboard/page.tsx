import { getEntries } from "@/lib/entries";
import { EntryCard } from "@/components/entry-card";
import type { JournalEntry } from "@/lib/types";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { isFuture } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function CapsuleGrid({
  entries,
  emptyTitle,
  emptyMessage,
}: {
  entries: JournalEntry[];
  emptyTitle: string;
  emptyMessage: string;
}) {
  return (
    <div>
      {entries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-card/50 rounded-lg border-dashed border-2">
          <h3 className="text-xl font-headline mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

function CapsulesSkeleton() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
      <section>
         <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function DashboardPage() {
  const entries = await getEntries();
  const unlockedEntries = entries.filter(
    (entry) => !isFuture(entry.unlockDate)
  );
  const lockedEntries = entries.filter((entry) => isFuture(entry.unlockDate));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-headline">Your Time Capsules</h1>
        <p className="text-muted-foreground">
          Discover memories you've unlocked and anticipate those still waiting in time.
        </p>
      </div>
      <Suspense fallback={<CapsulesSkeleton />}>
        <div className="space-y-12">
          <section id="unlocked">
            <div className="flex items-center gap-3 mb-4">
              <Unlock className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold font-headline">
                Unlocked Memories
              </h2>
              <Badge variant="secondary">{unlockedEntries.length} Revealed</Badge>
            </div>
            <CapsuleGrid
              entries={unlockedEntries}
              emptyTitle="No Unlocked Capsules... Yet!"
              emptyMessage="Memories you've sealed will appear here once their unlock date arrives."
            />
          </section>

          <Separator />

          <section id="locked">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold font-headline">
                Locked & Waiting
              </h2>
              <Badge variant="outline">{lockedEntries.length} Sealed</Badge>
            </div>
            <CapsuleGrid
              entries={lockedEntries}
              emptyTitle="Your Vault is Empty"
              emptyMessage="Ready to seal a new memory? Create a capsule for your future self to discover."
            />
          </section>
        </div>
      </Suspense>
    </div>
  );
}
