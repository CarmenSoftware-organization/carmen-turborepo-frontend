import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import PostAndUploadFile, { FileWithPreview } from './PostAndUploadFile';
import { File } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { fetchUnitComments } from '@/services/unit';
import { postComment } from '@/services/comment';

interface UserInfo {
    firstname: string;
    lastname: string;
    middlename?: string;
    profilePic?: string;
}

interface CommentAttachment {
    name: string;
    size: number;
    type: string;
    preview?: string;
}

interface UnitComment {
    id: string;
    message: string;
    created_at: string;
    updated_at: string;
    full_name: string;
    userInfo?: UserInfo[];
    attachments: CommentAttachment[];
}

export const Comment = () => {
    const { accessToken, tenantId, authState } = useAuth();
    const token = accessToken || '';
    const [comments, setComments] = useState<UnitComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getFullName = (comment: UnitComment): string => {
        if (comment.userInfo && comment.userInfo.length > 0) {
            const { firstname, lastname, middlename } = comment.userInfo[0];
            return `${firstname} ${middlename ? middlename + ' ' : ''}${lastname}`.trim();
        }
        return comment.full_name || 'Unknown User';
    };

    const getInitial = (comment: UnitComment): string => {
        if (comment.userInfo && comment.userInfo.length > 0) {
            const { firstname } = comment.userInfo[0];
            return firstname.charAt(0).toUpperCase();
        }
        return comment.full_name?.charAt(0).toUpperCase() || 'U';
    };

    const getProfilePic = (comment: UnitComment): string | undefined => {
        if (comment.userInfo && comment.userInfo.length > 0) {
            return comment.userInfo[0].profilePic;
        }
        return undefined;
    };

    const formatDate = (dateString: string): string => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    };

    const getFileIcon = (type: string | undefined) => {
        if (!type) return <File className="h-4 w-4 text-gray-500" />;

        if (type.includes('pdf')) {
            return <File className="h-4 w-4 text-red-500" />;
        }
        if (type.includes('word') || type.includes('doc')) {
            return <File className="h-4 w-4 text-blue-500" />;
        }
        if (type.includes('sheet') || type.includes('excel') || type.includes('xls')) {
            return <File className="h-4 w-4 text-green-500" />;
        }

        return <File className="h-4 w-4 text-gray-500" />;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const handleFetchComments = async () => {
        setLoading(true);
        try {
            const result = await fetchUnitComments(token, tenantId);
            setComments(result.data as UnitComment[]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (message: string, files: FileWithPreview[]) => {
        try {
            const newComment: UnitComment = {
                id: Math.random().toString(36).substring(2),
                message,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                full_name: authState?.user?.username || '',
                attachments: files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };

            const payload = {
                type: "user",
                message: message
            }
            const url = '/api/comment/unit';
            await postComment(token, tenantId, url, payload);
            toastSuccess({ message: 'Comment submitted successfully' });
            setComments(prev => [newComment, ...prev]);

        } catch (error) {
            toastError({ message: `Error submit ${error}` })
            throw error;
        }
    };

    useEffect(() => {
        handleFetchComments();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    {loading ? (
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ) : error ? (
                        <div className="rounded bg-red-50 text-red-500 p-3 my-2">
                            <p>Error: {error}</p>
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            No comments found
                        </p>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                >
                                    <p className="text-[10px] text-gray-500 text-right">
                                        {formatDate(comment.updated_at)}
                                    </p>
                                    <div className="flex items-start gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={getProfilePic(comment)}
                                                alt={getFullName(comment)}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {getInitial(comment)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px]">
                                                    {getFullName(comment)}
                                                </p>
                                            </div>
                                            <p className="text-[12px] font-medium">{comment.message}</p>
                                        </div>
                                    </div>
                                    {comment.attachments && comment.attachments.length > 0 && (
                                        <div className="mt-1 pt-1 border-t border-gray-200">
                                            <p className="text-[8px] font-medium mb-1">Attachments:</p>
                                            <div className="flex flex-col gap-1">
                                                {comment.attachments.map((attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="h-4 w-4 flex items-center justify-center">
                                                            {getFileIcon(attachment.type)}
                                                        </div>
                                                        <a
                                                            href="#"
                                                            className="text-[8px] text-blue-600 hover:underline truncate"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Add your file download/view logic here
                                                            }}
                                                        >
                                                            {attachment.name}
                                                            <span className="text-gray-500 ml-1">
                                                                ({formatFileSize(attachment.size)})
                                                            </span>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <div className="border-t bg-background p-2">
                <PostAndUploadFile onSubmit={handleSubmitComment} />
            </div>
        </div>
    );
};
