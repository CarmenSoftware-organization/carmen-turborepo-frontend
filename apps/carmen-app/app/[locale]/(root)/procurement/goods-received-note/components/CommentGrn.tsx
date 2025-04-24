import { Card } from "@/components/ui/card";
import { mockCommentGrn } from "../type.dto";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from 'uuid';

export default function CommentGrn() {
    const [comment, setComment] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [comments, setComments] = useState(mockCommentGrn);

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        if (!comment.trim()) return;

        // Create new comment object
        const newComment = {
            id: uuidv4(),
            poster: "You", // Can be replaced with actual user info
            message: comment,
            date: new Date().toLocaleString(),
            attachments: selectedFile ? [{
                id: uuidv4(),
                file: selectedFile.name
            }] : undefined
        };

        // Add new comment to the list
        setComments(prevComments => [...prevComments, newComment]);

        // Reset form
        setComment("");
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="p-4">
            <p className="font-semibold text-base mb-2">Comments & Attachments</p>
            <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <Card key={comment.id} className="p-2">

                            <div className="flex items-start gap-2">
                                <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center">
                                    {comment.poster.charAt(0)}
                                </div>

                                <div className="w-full">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-xs">{comment.poster}</p>
                                        <p className="text-xs">{comment.date}</p>
                                    </div>
                                    <p className="text-xs">{comment.message}</p>

                                    {comment.attachments && comment.attachments.length > 0 && (
                                        <div>
                                            {comment.attachments.map((attachment) => (
                                                <button
                                                    key={attachment.id}
                                                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                    aria-label={`Download ${attachment.file}`}
                                                    onClick={() => console.log(`Downloading ${attachment.file}`)}
                                                >
                                                    <span>• {attachment.file}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
            <div className="mt-2 space-y-2">
                <Textarea
                    placeholder="Add a comment"
                    value={comment}
                    onChange={handleCommentChange}
                />

                {/* File upload input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="comment-file-upload"
                />

                {/* Show selected file or upload button */}
                {selectedFile ? (
                    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center gap-2 text-xs">
                            <Paperclip className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={handleRemoveFile}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadClick}
                            className="gap-1"
                        >
                            <Paperclip className="h-3 w-3" />
                            Attach File
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSend}
                            disabled={!comment.trim()}
                        >
                            <Send className="mr-1 h-4 w-4" />
                            Send
                        </Button>
                    </div>
                )}

                {selectedFile && (
                    <div className="text-right">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleSend}
                            className="gap-1"
                        >
                            <Send className="h-4 w-4" />
                            Send with Attachment
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
