import { Card } from "@/components/ui/card";
import { mockCommentGrn } from "../type.dto";

export default function CommentGrn() {
    return (
        <Card className="p-4">
            <p className="font-semibold text-base mb-2">Comments & Attachments</p>
            <div className="space-y-2">
                {mockCommentGrn.map((comment) => (
                    <Card key={comment.id} className="p-2">

                        <div className="flex items-start gap-2">
                            <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center">
                                {comment.poster.charAt(0)}
                            </div>

                            <div>
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-xs">{comment.poster}</p>
                                    <p className="text-xs">{comment.date}</p>
                                </div>
                                <p className="text-xs">{comment.message}</p>

                                {comment.attachments && comment.attachments.length > 0 && (
                                    <div>
                                        {comment.attachments.map((attachment) => (
                                            <button
                                                key={attachment.id}
                                                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                                aria-label={`Download ${attachment.file}`}
                                                onClick={() => console.log(`Downloading ${attachment.file}`)}
                                            >
                                                <span>• {attachment.file}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
}
