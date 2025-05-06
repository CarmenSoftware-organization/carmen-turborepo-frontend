import CreditNoteComponent from "./components/CreditNoteComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Credit Note",
};
export default function CreditNotePage() {
    return <CreditNoteComponent />;
} 