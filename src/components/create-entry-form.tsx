"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Image as ImageIcon, Loader2, Send } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { addEntry } from "@/lib/entries"


const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title must not be longer than 100 characters.",
  }),
  content: z.string().min(10, {
    message: "Your entry must be at least 10 characters long.",
  }),
  unlockDate: z.date({
    required_error: "An unlock date is required.",
  }).min(new Date(new Date().setDate(new Date().getDate() + 1)), {
    message: "Unlock date must be in the future.",
  }),
  image: z.any().optional(),
})

export function CreateEntryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined = undefined;
      const imageFile = values.image?.[0];

      if (imageFile) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(imageFile);
        });
      }

      const { image, ...restOfValues } = values;

      const result = await addEntry({ ...restOfValues, imageUrl });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast({
        title: "Capsule Sealed!",
        description: `Your memory '${values.title}' is now waiting for the future.`,
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to create capsule:", error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: error instanceof Error ? error.message : "There was a problem saving your capsule. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capsule Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A Letter to My Future Self" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your memory a title to remember it by.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Memory</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell your future self something...
- What are your hopes and dreams right now?
- What challenges are you facing?
- What do you cherish most at this moment?"
                      className="resize-y min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="unlockDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Unlock Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick an unlock date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate()))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                     <FormDescription>
                      The day your memory will be revealed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Attach a Photo</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="file"
                              className="pl-9"
                              accept="image/*"
                              onChange={(event) => onChange(event.target.files)}
                              {...fieldProps}
                            />
                        </div>
                    </FormControl>
                    <FormDescription>
                      A picture is worth a thousand words.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
               <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Sealing..." : "Seal Your Capsule"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
