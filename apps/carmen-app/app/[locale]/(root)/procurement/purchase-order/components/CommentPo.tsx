import CommentComponent, { CommentItem } from "@/components/comment-activity/CommentComponent";

export default function CommentPo() {

    const mockCommentGrn: CommentItem[] = [
        {
            id: "1",
            poster: "John Doe",
            message: "This is a comment",
            date: new Date().toISOString(),
            attachments: [],
        },
        {
            id: "2",
            poster: "Jane Doe",
            message: "This is a comment",
            date: new Date().toISOString(),
            attachments: [],
        },
        {
            id: "3",
            poster: "John Doe",
            message: "This is a comment",
            date: new Date().toISOString(),
            attachments: [],
        },
    ];


    return (
        <CommentComponent
            initialComments={mockCommentGrn}
            onFileDownload={(attachment) => console.log(`Downloading ${attachment.file}`)}
        />
    );
}
