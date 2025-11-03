import { Kbd } from "@/components/ui/kbd";
import { useRouter } from "@/i18n/routing";
import { ArrowLeftIcon } from "lucide-react";

interface Props {
    mode: "add" | "edit" | "view";
    setMode: (mode: "add" | "edit" | "view") => void;
}

export default function FormCluster({ mode, setMode }: Props) {
    const router = useRouter();

    const onBack = () => {
        if (mode === "add") {
            router.push("/cluster");
        } else {
            setMode("view");
        }
    };

    return (
        <div>
            <Kbd onClick={onBack}>
                <ArrowLeftIcon />
            </Kbd>
        </div>
    )
}