import FormSpotCheck from "../components/FormSpotCheck";
import { formType } from "@/dtos/form.dto";
export default function SpotCheckNewPage() {
    return <FormSpotCheck mode={formType.ADD} />
}
