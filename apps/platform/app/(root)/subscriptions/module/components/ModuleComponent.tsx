import { Button } from "@/components/ui/button";
import { mockModules } from "@/mock-data/module.data";
import ModuleList from "./ModuleList";

export default function ModuleComponent() {
    const modules = mockModules;
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Modules</h2>
                    <p className="text-muted-foreground">
                        Manage modules available in subscription plans
                    </p>
                </div>
                <Button size="sm">Add Module</Button>
            </div>
            <ModuleList modules={modules} />
        </div>
    )
}




