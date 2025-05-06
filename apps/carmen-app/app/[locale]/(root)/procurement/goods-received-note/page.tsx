import GoodsReceivedNoteComponent from "./components/GoodsReceivedNoteComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Goods Received Note",
};
export default function GoodsReceivedNotePage() {
    return <GoodsReceivedNoteComponent />;
} 