'use server';

import { revalidatePath } from 'next/cache';
import connectToDB from '@/lib/mongodb';
import Entry from '@/lib/models/entry.model';
import User from '@/lib/models/user.model';
import type { JournalEntry } from "@/lib/types";

// Helper to get a user ID to associate with a new capsule.
// In a real app, this would come from the user's session.
// For this demo, we'll just grab the first user we find.
async function getDemoUserId() {
    await connectToDB();
    const user = await User.findOne().sort({ createdAt: 1 });
    if (!user) {
        throw new Error("No users found in the database. Please sign up for an account first.");
    }
    return user._id;
}


export async function getEntries(): Promise<JournalEntry[]> {
    try {
        await connectToDB();
        // In a real app with sessions, you would filter by userId here.
        const entries = await Entry.find({}).sort({ createdAt: -1 }).lean();
        
        // Safely convert MongoDB documents to plain objects that can be passed to client components.
        return entries.map(entry => {
            if (!entry._id) return null;
            return {
                id: entry._id.toString(),
                 title: entry.title,
                content: entry.content,
                imageUrl: entry.imageUrl,
                imageHint: entry.imageHint,
                unlockDate: new Date(entry.unlockDate),
                createdAt: new Date(entry.createdAt),
            };
        }).filter(Boolean) as JournalEntry[];
    } catch(error) {
        console.error("Database error fetching entries:", error);
        return [];
    }
}

export async function addEntry(
  entry: Omit<JournalEntry, "id" | "createdAt">
): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await getDemoUserId();
    
    await connectToDB();

    await Entry.create({
      ...entry,
      userId: userId,
      createdAt: new Date(),
    });
    
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (error) {
    console.error("Failed to add entry:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      ok: false,
      error: `Failed to save entry. Error: ${errorMessage}`
    };
  }
}
