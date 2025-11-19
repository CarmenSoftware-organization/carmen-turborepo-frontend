import { createMetadata } from "@/utils/metadata";
import CreditNoteComponent from "./_components/CreditNoteComponent";

export const generateMetadata = createMetadata("CreditNote", "title");

export default function CreditNotePage() {
  return <CreditNoteComponent />;
}
