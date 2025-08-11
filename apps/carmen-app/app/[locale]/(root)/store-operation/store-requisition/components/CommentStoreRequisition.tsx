import CommentComponent from "@/components/comment-activity/CommentComponent";
import { mockCommentStoreRequisition } from "@/mock-data/comment";

export default function CommentStoreRequisition() {
    return (
        <CommentComponent
            initialComments={mockCommentStoreRequisition}
            onFileDownload={(attachment) => console.log(`Downloading ${attachment.file}`)}
        />
    );
}
