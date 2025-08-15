import { FileText, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function RightSidebar() {
    return (
        <div className="flex flex-col gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size={'sm'} variant={'ghost'} className="hover:bg-transparent">
                        <FileText />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <Sheet>
                <SheetTrigger asChild>
                    <Button size={'sm'} variant={'ghost'} className="hover:bg-transparent">
                        <MessageCircle />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure 222 ?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}