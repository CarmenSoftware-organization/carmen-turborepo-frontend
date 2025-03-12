import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useAuth } from '@/app/context/AuthContext';
import { Paperclip, X, Send, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileWithPreview {
    id: string;
    preview?: string;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    slice: (start?: number, end?: number, contentType?: string) => Blob;
    stream: () => ReadableStream<Uint8Array>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
}

const formatFileSize = (bytes: number | undefined): string => {
    if (bytes === undefined || bytes === null) return 'Size unknown';
    if (bytes === 0) return '0 Bytes';

    try {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        if (isNaN(bytes) || !isFinite(bytes)) return 'Size unknown';

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    } catch (error) {
        console.error('Error formatting file size:', error);
        return 'Size unknown';
    }
};

interface PostAndUploadFileProps {
    onSubmit: (message: string, files: FileWithPreview[]) => Promise<void>;
}

const PostAndUploadFile: React.FC<PostAndUploadFileProps> = ({ onSubmit }) => {
    const [message, setMessage] = useState('');
    const [messageError, setMessageError] = useState('');
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const { accessToken, tenantId } = useAuth();

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);

        // Clear error when user starts typing
        if (messageError) {
            setMessageError('');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files).map(file => {
            const fileWithPreview = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                slice: file.slice.bind(file),
                stream: file.stream.bind(file),
                text: file.text.bind(file),
                arrayBuffer: file.arrayBuffer.bind(file),
                id: Math.random().toString(36).substring(2, 11),
                preview: file.type.startsWith('image/')
                    ? URL.createObjectURL(file)
                    : undefined
            };

            return fileWithPreview;
        });

        setFiles(prev => [...prev, ...newFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (id: string) => {
        setFiles(files.filter(file => file.id !== id));
    };

    const isSubmitDisabled = !message.trim() || isUploading;

    const handleSubmit = async () => {
        if (isSubmitDisabled) return;

        setIsUploading(true);

        try {
            await onSubmit(message, files);
            setMessage('');
            setFiles([]);
            setMessageError('');

        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const getFileIcon = (fileName: string | undefined) => {
        if (!fileName) return <File className="h-4 w-4 text-gray-500" />;
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <File className="h-4 w-4 text-red-500" />;
            case 'doc':
            case 'docx':
                return <File className="h-4 w-4 text-blue-500" />;
            case 'xls':
            case 'xlsx':
                return <File className="h-4 w-4 text-green-500" />;
            case 'ppt':
            case 'pptx':
                return <File className="h-4 w-4 text-orange-500" />;
            default:
                return <File className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="space-y-1">
                <Textarea
                    placeholder="Write a comment..."
                    value={message}
                    onChange={handleMessageChange}
                    className={cn(
                        "min-h-10 text-sm focus-visible:ring-1",
                        messageError && "border-red-500 focus-visible:ring-red-500"
                    )}
                />
                {messageError && (
                    <p className="text-xs text-red-500">{messageError}</p>
                )}
            </div>

            {/* File attachments preview */}
            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map(file => (
                        <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 rounded-md bg-background border "
                        >
                            {file.preview ? (
                                <div className="h-8 w-8 rounded overflow-hidden bg-background">
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded flex items-center justify-center bg-background">
                                    {getFileIcon(file.name)}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveFile(file.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload progress */}
            {isUploading && (
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[10px] gap-1"
                                disabled={isUploading}
                            >
                                <Paperclip />
                                Attach
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem className="text-[10px]" onClick={() => fileInputRef.current?.click()}>
                                Upload files
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[10px]"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.accept = "image/*";
                                        fileInputRef.current.click();
                                    }
                                }}
                            >
                                Upload images
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Button
                    size="sm"
                    className={cn(
                        "text-[10px] gap-1",
                        isSubmitDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSubmitDisabled}
                    onClick={handleSubmit}
                >
                    <Send />
                    Send
                </Button>
            </div>
        </div>
    );
};

export default PostAndUploadFile;