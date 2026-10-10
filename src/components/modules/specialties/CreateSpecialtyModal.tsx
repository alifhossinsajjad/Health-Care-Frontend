"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSpecialty } from "@/src/services/specialty.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Optional: toast if configured
// import { useToast } from "@/src/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50),
});

export default function CreateSpecialtyModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      // Show an error for the file
      form.setError("root", { message: "Please select an icon file" });
      return;
    }

    setIsLoading(true);
    
    // Construct FormData correctly as per API expectations
    const formData = new FormData();
    // API expects `data` field to contain JSON string for specialty info
    formData.append("data", JSON.stringify({ title: values.title }));
    formData.append("file", selectedFile);

    const res = await createSpecialty(formData);

    if (res.success) {
      // Success handling
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setOpen(false);
      router.refresh(); // Refresh Next.js server component to fetch new data
    } else {
      // Error handling
      form.setError("root", { message: res.message || "Something went wrong" });
    }
    
    setIsLoading(false);
  }

  // Handle dialog close correctly to reset states
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 shadow-md shadow-blue-500/20">
          <Plus className="w-4 h-4 mr-1" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Specialty</DialogTitle>
          <DialogDescription>
            Add a new medical specialty to the system. You must upload a recognizable icon.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Specialty Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cardiology" {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Specialty Icon</FormLabel>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <div className="w-16 h-16 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-2 overflow-hidden shrink-0">
                    <Image src={previewUrl} alt="Preview" width={48} height={48} className="object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-zinc-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="cursor-pointer file:cursor-pointer file:bg-zinc-100 file:hover:bg-zinc-200 file:border-0 file:text-sm file:font-semibold file:py-1 file:px-3 file:rounded-full file:mr-4 dark:file:bg-zinc-800 dark:file:hover:bg-zinc-700 file:transition-colors text-sm"
                  />
                  <p className="text-xs text-zinc-500 mt-1.5">Max size 2MB. SVG, PNG, JPG allowed.</p>
                </div>
              </div>
            </div>

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Specialty"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
