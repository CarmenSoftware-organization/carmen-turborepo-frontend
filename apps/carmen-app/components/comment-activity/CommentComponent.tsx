import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Paperclip,
  Send,
  X,
  Loader2,
  FileText,
  Image,
  FileSpreadsheet,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttachmentDto, GetPrCommentAttachmentDto } from "@/dtos/comment-attachments.dto";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useTranslations } from "next-intl";

const getUniqueFileName = (fileName: string, existingNames: string[]): string => {
  if (!existingNames.includes(fileName)) {
    return fileName;
  }

  const lastDotIndex = fileName.lastIndexOf(".");
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  const extension = lastDotIndex > 0 ? fileName.slice(lastDotIndex) : "";

  let counter = 1;
  let newName = `${baseName} (${counter})${extension}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (${counter})${extension}`;
  }

  return newName;
};

type CommentComponentProps = {
  readonly comments: GetPrCommentAttachmentDto[];
  readonly currentUserId?: string;
  readonly isLoading?: boolean;
  readonly isSending?: boolean;
  readonly isUpdating?: boolean;
  readonly isUpdatingAttachments?: boolean;
  readonly onCommentAdd?: (message: string, attachments: AttachmentDto[]) => void;
  readonly onCommentEdit?: (
    commentId: string,
    message: string,
    attachments?: AttachmentDto[]
  ) => void;
  readonly onCommentDelete?: (commentId: string) => void;
  readonly onFileDownload?: (attachment: AttachmentDto) => void;
  readonly onFileUpload?: (file: File) => Promise<AttachmentDto | null>;
};

export default function CommentComponent({
  comments = [],
  currentUserId,
  isLoading = false,
  isSending = false,
  isUpdating = false,
  isUpdatingAttachments = false,
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  onFileDownload = (attachment) => window.open(attachment.fileUrl, "_blank"),
  onFileUpload,
}: CommentComponentProps) {
  const t = useTranslations("CommentAttachments");

  const [message, setMessage] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<AttachmentDto[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inline edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string>("");
  const [editAttachments, setEditAttachments] = useState<AttachmentDto[]>([]);
  const [isUploadingEditFile, setIsUploadingEditFile] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Inline edit handlers
  const handleStartEdit = (comment: GetPrCommentAttachmentDto) => {
    setEditingCommentId(comment.id);
    setEditMessage(comment.message);
    setEditAttachments(comment.attachments || []);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditMessage("");
    setEditAttachments([]);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editMessage.trim()) return;

    // Save message and attachments together
    onCommentEdit?.(editingCommentId, editMessage, editAttachments);

    setEditingCommentId(null);
    setEditMessage("");
    setEditAttachments([]);
  };

  const handleRemoveEditAttachment = (fileToken: string) => {
    setEditAttachments((prev) => prev.filter((att) => att.fileToken !== fileToken));
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onFileUpload) return;

    setIsUploadingEditFile(true);
    try {
      // Get existing file names for duplicate check
      const existingNames = editAttachments.map((att) => att.fileName);
      const newAttachments: AttachmentDto[] = [];

      for (const file of Array.from(files)) {
        const uploaded = await onFileUpload(file);
        if (uploaded) {
          // Check for duplicate and rename if needed
          const allNames = [...existingNames, ...newAttachments.map((a) => a.fileName)];
          const uniqueName = getUniqueFileName(uploaded.fileName, allNames);
          newAttachments.push({ ...uploaded, fileName: uniqueName });
        }
      }

      if (newAttachments.length > 0) {
        setEditAttachments((prev) => [...prev, ...newAttachments]);
      }
    } finally {
      setIsUploadingEditFile(false);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    }
  };

  const handleEditUploadClick = () => {
    editFileInputRef.current?.click();
  };

  // Delete handlers
  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (commentToDelete) {
      onCommentDelete?.(commentToDelete);
    }
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Upload files immediately if onFileUpload is provided
    if (onFileUpload) {
      setIsUploadingFiles(true);
      try {
        // Get existing file names for duplicate check
        const existingNames = uploadedAttachments.map((att) => att.fileName);
        const newAttachments: AttachmentDto[] = [];

        for (const file of newFiles) {
          const uploaded = await onFileUpload(file);
          if (uploaded) {
            // Check for duplicate and rename if needed
            const allNames = [...existingNames, ...newAttachments.map((a) => a.fileName)];
            const uniqueName = getUniqueFileName(uploaded.fileName, allNames);
            newAttachments.push({ ...uploaded, fileName: uniqueName });
          }
        }

        if (newAttachments.length > 0) {
          setUploadedAttachments((prev) => [...prev, ...newAttachments]);
        }
      } finally {
        setIsUploadingFiles(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

  const handleRemoveFile = (fileKey: string) => {
    setSelectedFiles((prev) => prev.filter((f) => getFileKey(f) !== fileKey));
    // Find index of the file to remove from uploadedAttachments
    const fileIndex = selectedFiles.findIndex((f) => getFileKey(f) === fileKey);
    if (fileIndex !== -1) {
      setUploadedAttachments((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    if (onCommentAdd) {
      onCommentAdd(message, uploadedAttachments);
    }

    // Reset form
    setMessage("");
    setSelectedFiles([]);
    setUploadedAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getFileIcon = (contentType: string) => {
    if (contentType === "application/pdf") return <FileText className="h-2.5 w-2.5" />;
    if (contentType.startsWith("image/")) return <Image className="h-2.5 w-2.5" />;
    if (contentType.includes("spreadsheet")) return <FileSpreadsheet className="h-2.5 w-2.5" />;
    return <Paperclip className="h-2.5 w-2.5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  const getButtonText = () => {
    if (isSending) return t("sending");
    if (selectedFiles.length > 0) return t("send_with_attachments");
    return t("send");
  };

  return (
    <div>
      <ScrollArea className="h-[calc(75vh-120px)]">
        <div className="space-y-2">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{t("no_comments")}</p>
          ) : (
            comments.map((comment) => {
              const isEditing = editingCommentId === comment.id;
              const fullName = `${comment.firstname} ${comment.lastname}`;
              return (
                <Card
                  key={comment.id}
                  className="p-2 hover:bg-muted/30 transition-colors group mr-4"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-[11px] truncate">{fullName}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      {/* Inline edit or display message */}
                      {isEditing ? (
                        <div className="mt-1 space-y-1.5">
                          <Textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="text-[11px] min-h-[60px] resize-none"
                            autoFocus
                          />

                          {/* Edit attachments */}
                          {editAttachments.length > 0 && (
                            <div className="space-y-1">
                              {editAttachments.map((attachment) => (
                                <div
                                  key={attachment.fileToken}
                                  className="flex items-center gap-1.5 text-[10px] bg-muted/50 px-1.5 py-1 rounded"
                                >
                                  {getFileIcon(attachment.contentType)}
                                  <span className="truncate flex-1 text-foreground">
                                    {attachment.fileName}
                                  </span>
                                  <span className="text-muted-foreground shrink-0">
                                    {formatFileSize(attachment.size)}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveEditAttachment(attachment.fileToken)}
                                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Remove attachment"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Hidden file input for edit mode */}
                          <input
                            type="file"
                            ref={editFileInputRef}
                            onChange={handleEditFileChange}
                            className="hidden"
                            multiple
                          />

                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[10px]"
                              onClick={handleEditUploadClick}
                              disabled={isUploadingEditFile}
                            >
                              {isUploadingEditFile ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              ) : (
                                <Paperclip className="h-2.5 w-2.5" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-6 px-2 text-[10px]"
                              onClick={handleSaveEdit}
                              disabled={!editMessage.trim() || isUpdating || isUpdatingAttachments}
                            >
                              {isUpdating || isUpdatingAttachments ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              ) : (
                                <Save className="h-2.5 w-2.5" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[10px]"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] mt-0.5 whitespace-pre-wrap break-words">
                          {comment.message}
                        </p>
                      )}

                      {!isEditing && comment.attachments && comment.attachments.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {comment.attachments.map((attachment) => (
                            <button
                              key={`${comment.id}-${attachment.fileToken}`}
                              className="flex items-center gap-1.5 text-[10px] bg-muted/50 hover:bg-muted px-1.5 py-1 rounded transition-colors w-full text-left"
                              aria-label={`Download ${attachment.fileName}`}
                              onClick={() => onFileDownload(attachment)}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  onFileDownload(attachment);
                                }
                              }}
                            >
                              {getFileIcon(attachment.contentType)}
                              <span className="truncate flex-1 text-foreground">
                                {attachment.fileName}
                              </span>
                              <span className="text-muted-foreground shrink-0">
                                {formatFileSize(attachment.size)}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action buttons - show on hover only for comment owner */}
                      {!isEditing && currentUserId === comment.user_id && (
                        <div className="flex items-center justify-end gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onCommentEdit && (
                            <Button
                              onClick={() => handleStartEdit(comment)}
                              aria-label="Edit comment"
                              size={"sm"}
                              variant={"ghost"}
                              className="h-6 px-2"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                            </Button>
                          )}
                          {onCommentDelete && (
                            <Button
                              onClick={() => handleDeleteClick(comment.id)}
                              aria-label="Delete comment"
                              size={"sm"}
                              variant={"destructive"}
                              className="h-6 px-2"
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
      <div className="mt-2 space-y-2">
        <Textarea placeholder="Add a comment" value={message} onChange={handleCommentChange} />

        {/* File upload input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="comment-file-upload"
          multiple
        />

        {/* Show selected files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-1">
            {selectedFiles.map((file) => (
              <div
                key={getFileKey(file)}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Paperclip className="h-2.5 w-2.5" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                  {isUploadingFiles && (
                    <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemoveFile(getFileKey(file))}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="gap-1"
            disabled={isUploadingFiles}
          >
            {isUploadingFiles ? (
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
            ) : (
              <Paperclip className="h-2.5 w-2.5" />
            )}
            {t("attachments")}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSend}
            disabled={!message.trim() || isSending || isUploadingFiles}
            className="gap-1"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {getButtonText()}
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t("del_title")}
        description={t("del_desc")}
      />
    </div>
  );
}
