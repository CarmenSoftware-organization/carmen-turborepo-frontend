"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "./ToolBar";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";

interface RichTextEditorProps {
  readonly content: string;
  readonly onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
        blockquote: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
      ImageResize,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} className="text-primary" />
    </div>
  );
}
