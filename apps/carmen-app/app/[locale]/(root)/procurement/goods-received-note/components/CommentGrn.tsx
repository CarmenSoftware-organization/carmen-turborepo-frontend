import { mockCommentGrn } from "../type.dto";
import CommentComponent, { CommentItem } from "@/components/ui-custom/CommentComponent";

export default function CommentGrn() {
    // Convert the mockCommentGrn to match the CommentItem type structure
    // Ensuring attachments is always an array (never undefined)
    const formattedComments: CommentItem[] = mockCommentGrn.map(comment => ({
        ...comment,
        attachments: comment.attachments || []
    }));

    return (
        <CommentComponent
            initialComments={formattedComments}
            title="Comments & Attachments"
            scrollAreaHeight="h-[200px]"
            onFileDownload={(attachment) => console.log(`Downloading ${attachment.file}`)}
        />
    );
}
