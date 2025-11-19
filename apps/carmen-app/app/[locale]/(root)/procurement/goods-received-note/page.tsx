import GoodsReceivedNoteComponent from "./_components/GoodsReceivedNoteComponent";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("Modules", "title");

export default function GoodsReceivedNotePage() {
  return <GoodsReceivedNoteComponent />;
}
