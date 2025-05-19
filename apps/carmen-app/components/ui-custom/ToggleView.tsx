import { VIEW } from "@/constants/enum";
import { Button } from "../ui/button";
import { Grid, List } from "lucide-react";
interface ViewToggleButtonsProps {
    readonly view: VIEW;
    readonly setView: (view: VIEW) => void;
}
export default function ToggleView({ view, setView }: ViewToggleButtonsProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant={view === VIEW.LIST ? 'default' : 'outline'}
                size={'sm'}
                onClick={() => setView(VIEW.LIST)}
                aria-label="List view"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={view === VIEW.GRID ? 'default' : 'outline'}
                size={'sm'}
                onClick={() => setView(VIEW.GRID)}
                aria-label="Grid view"
            >
                <Grid className="h-4 w-4" />
            </Button>
        </div>
    )
}
