import CommentComponent, { CommentItem } from "@/components/comment-activity/CommentComponent";

type AttachmentDto = {
    id: string;
    file: string;
};

type CommentGrn = {
    id: string;
    poster: string;
    message: string;
    date: string;
    attachments?: AttachmentDto[];
};

const mockCommentGrn: CommentGrn[] = [
    {
        id: "cm-grn-001",
        poster: "Hiroshi Tanaka",
        message: "Vendor confirmed the order details",
        date: "2023-01-15",
        attachments: [
            {
                id: "xosidkc",
                file: "order_confirmation.pdf"
            }
        ]
    },
    {
        id: "cm-grn-002",
        poster: "Samantha Lee",
        message: "Waiting for warehouse confirmation",
        date: "2023-01-15",
        attachments: []
    },
    {
        id: "cm-grn-003",
        poster: "Mohammed Al-Farsi",
        message: "Shipping documents attached",
        date: "2023-01-15",
        attachments: [
            {
                id: "abcd1234",
                file: "shipping_doc.jpeg"
            },
            {
                id: "efgh5678",
                file: "invoice.pdf"
            }
        ]
    },
    {
        id: "cm-grn-004",
        poster: "Nattapong S.",
        message: "Reviewed and approved.",
        date: "2023-01-15",
        attachments: []
    }
];


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
