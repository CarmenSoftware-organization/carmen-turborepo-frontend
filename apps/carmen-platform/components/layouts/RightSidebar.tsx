import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'

export default function RightSidebar() {
    return (
        <div className="w-14 flex flex-col space-y-2 border-l p-1">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size={'sm'} variant={'ghost'} className="hover:bg-transparent">
                        <Image src={'/icons/file-text.svg'} alt="logo" width={24} height={24} />
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
                        <Image src={'/icons/message.svg'} alt="logo" width={24} height={24} />
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