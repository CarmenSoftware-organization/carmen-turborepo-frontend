import { formType } from "@/dtos/form.dto";
import PrtForm from "../_components/form/PrtForm";
import { ErrorBoundary } from "@sentry/nextjs";

export default function PurchaseRequestTemplateNewPage() {
  return (
    <ErrorBoundary>
      <PrtForm mode={formType.ADD} />
    </ErrorBoundary>
  );
}
