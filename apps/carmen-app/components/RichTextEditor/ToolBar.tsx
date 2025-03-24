"use client";

import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import {
    Heading1,
    Heading2,
    Heading3,
    Code,
    Bold,
    Italic,
    Strikethrough,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Highlighter,
    Upload,
    ListOrdered,
    List
} from "lucide-react";

interface ToolBarProps {
    readonly editor: Editor | null;
}

export default function ToolBar({ editor }: ToolBarProps) {
    if (!editor) return null;
    const addImage = () => {
        const url = window.prompt("URL");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const Options = [
        {
            id: "heading1",
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            preesed: editor.isActive("heading", { level: 1 }),
        },
        {
            id: "heading2",
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            preesed: editor.isActive("heading", { level: 2 }),
        },
        {
            id: "heading3",
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            preesed: editor.isActive("heading", { level: 3 }),
        },
        {
            id: "bold",
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            preesed: editor.isActive("bold"),
        },
        {
            id: "italic",
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            preesed: editor.isActive("italic"),
        },
        {
            id: "strikethrough",
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            preesed: editor.isActive("strike"),
        },
        {
            id: "alignLeft",
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            preesed: editor.isActive({ textAlign: "left" }),
        },
        {
            id: "alignCenter",
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            preesed: editor.isActive({ textAlign: "center" }),
        },
        {
            id: "alignRight",
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            preesed: editor.isActive({ textAlign: "right" }),
        },
        {
            id: "bulletList",
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            preesed: editor.isActive("bulletList"),
        },
        {
            id: "orderedList",
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            preesed: editor.isActive("orderedList"),
        },
        {
            id: "codeBlock",
            icon: <Code className="size-4" />,
            onClick: () => editor.chain().focus().toggleCodeBlock().run(),
            preesed: editor.isActive("code"),
        },
        {
            id: "highlight",
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            preesed: editor.isActive("highlight"),
        },
        {
            id: "image",
            icon: <Upload className="size-4" />,
            onClick: () => addImage(),
            preesed: editor.isActive("image"),
        },
    ];

    return (
        <div className="border rounded-md p-1.5 mb-1 space-x-1 sticky top-10 z-50">
            {Options.map((option) => (
                <Toggle
                    key={option.id}
                    size="sm"
                    pressed={option.preesed}
                    onPressedChange={option.onClick}
                >
                    {option.icon}
                </Toggle>
            ))}
        </div>
    );
}