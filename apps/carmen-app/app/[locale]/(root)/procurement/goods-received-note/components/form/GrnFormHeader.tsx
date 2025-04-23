import { GrnHeaderDto } from "../../type.dto";


interface GrnFormHeaderProps {
    readonly info?: GrnHeaderDto;
}

export default function GrnFormHeader({ info }: GrnFormHeaderProps) {
    return (
        <div>
            <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
    )
}

