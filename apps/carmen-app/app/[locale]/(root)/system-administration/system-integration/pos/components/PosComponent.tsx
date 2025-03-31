"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PosList from "./PosList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link } from "@/lib/navigation";

export default function PosComponent() {
    const title = "POS";

    const actionButtons = (
        <div className="action-btn-container" data-id="pos-action-buttons">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/system-administration/system-integration/pos/settings/config">
                            POS Configuration
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/system-administration/system-integration/pos/settings/system">
                            System Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    const content = <PosList />

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            content={content}
        />
    );
}
