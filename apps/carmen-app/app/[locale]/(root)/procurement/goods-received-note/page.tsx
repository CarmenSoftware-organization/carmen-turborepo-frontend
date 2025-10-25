import { Metadata } from "next";
import GoodsReceivedNoteComponent from "./_components/GoodsReceivedNoteComponent";

export const metadata: Metadata = {
    title: "Goods Received Note",
};
export default function GoodsReceivedNotePage() {
    return <GoodsReceivedNoteComponent />;
}  