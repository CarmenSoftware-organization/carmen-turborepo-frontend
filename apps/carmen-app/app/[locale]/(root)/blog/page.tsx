"use client";

import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


const extractTextFromHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent?.trim() ?? "";
}


const formSchema = z.object({
    post: z.string().refine(
        (value) => {
            return extractTextFromHTML(value).trim().length >= 5;
        },
        {
            message: "The text must be at least 5 characters long after trimming",
        }
    ),
});

export default function BlogPage() {
    const [submittedData, setSubmittedData] = useState<string | null>(null);

    const readOnlyEditor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '',
        editable: false,
        immediatelyRender: false,
    });

    // Update editor content when submittedData changes
    useEffect(() => {
        if (readOnlyEditor && submittedData) {
            readOnlyEditor.commands.setContent(submittedData);
        }
    }, [readOnlyEditor, submittedData]);

    const form = useForm({
        mode: "onTouched",
        resolver: zodResolver(formSchema),
        defaultValues: {
            post: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        setSubmittedData(data.post);
    };

    return (
        <div className="max-w-3xl mx-auto py-5">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="post"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        content={field.value}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-4">Submit</Button>
                </form>
            </Form>

            {submittedData && (
                <div className="mt-2 border rounded-lg p-4">
                    <div className="prose max-w-none">
                        <EditorContent editor={readOnlyEditor} />
                    </div>
                </div>
            )}
        </div>
    )
}
