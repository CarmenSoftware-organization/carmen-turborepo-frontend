import { SupportType } from "@/dto/support.dto";
interface OverviewTabProps {
    readonly supports: SupportType;
}

export default function OverviewTab({ supports }: OverviewTabProps) {
    return (
        <div>
            <h1>Overview Tab</h1>
        </div>
    )
}
