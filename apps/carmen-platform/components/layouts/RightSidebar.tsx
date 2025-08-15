import { FileText, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function RightSidebar() {
    return (
        <div className="flex flex-col gap-2">
            <Button size={'sm'} variant={'ghost'}>
                <FileText />
            </Button>
            <Button size={'sm'} variant={'ghost'}>
                <MessageCircle />
            </Button>
        </div>
    )
}