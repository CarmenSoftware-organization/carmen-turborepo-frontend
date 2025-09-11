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
            onFileDownload={(attachment) => console.log(`Downloading ${attachment.file}`)}
        />
    );
}
