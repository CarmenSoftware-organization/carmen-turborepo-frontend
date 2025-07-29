import CommentComponent, { CommentItem } from "@/components/comment-activity/CommentComponent";
import { mockCommentGrn } from "../type.dto";

export default function CommentGrn() {
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
