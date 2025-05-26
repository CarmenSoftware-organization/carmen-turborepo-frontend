import { formType } from "@/dtos/form.dto";
import MainLocation from "../components/form/MainLocation";

export default function NewStoreLocationPage() {
    return <MainLocation mode={formType.ADD} />
}
