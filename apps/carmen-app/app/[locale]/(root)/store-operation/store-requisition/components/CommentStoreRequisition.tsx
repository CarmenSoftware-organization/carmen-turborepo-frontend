import { mockCommentStoreRequisition } from "@/mock-data/comment";
import CommentComponent from "@/components/ui-custom/CommentComponent";

export default function CommentStoreRequisition() {
    return (
        <CommentComponent
            initialComments={mockCommentStoreRequisition}
            title="Comments & Attachments"
            scrollAreaHeight="h-[200px]"
            onFileDownload={(attachment) => console.log(`Downloading ${attachment.file}`)}
        />
    );
}
