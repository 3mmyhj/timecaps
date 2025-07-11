import Link from "next/link";
import { CreateEntryForm } from "@/components/create-entry-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewEntryPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Capsules
        </Link>
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Create a New Time Capsule</h1>
        <p className="text-muted-foreground">Seal a memory for your future self to discover.</p>
      </div>
      <CreateEntryForm />
    </div>
  );
}
