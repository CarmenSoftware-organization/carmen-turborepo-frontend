import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import { formType } from "@/dtos/form.dto";

interface CnFormProps {
  readonly creditNote?: CreditNoteGetAllDto;
  readonly mode: formType;
}

export default function CnForm({ creditNote, mode }: CnFormProps) {
  return (
    <div>
      <h1>{mode === formType.ADD ? "New Credit Note" : "Edit Credit Note"}</h1>
      {creditNote && <pre>{JSON.stringify(creditNote, null, 2)}</pre>}
    </div>
  );
}
