import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n';
import { export_text, print_text } from '@/paraglide/messages';
import { FileDown, Plus, Printer } from 'lucide-react';
import React, { useMemo } from 'react'

const GrnActions = () => {
    const actionButtons = useMemo(
        () => (
            <div className="action-btn-container">
                <Button asChild variant={'outline'} size={'sm'}>
                    <Link href="/procurement/goods-received-note/new">
                        <Plus />
                        Create Good Recieve Note
                    </Link>
                </Button>
                <Button variant="outline" className="group" size={'sm'}>
                    <FileDown />
                    {export_text()}
                </Button>
                <Button variant="outline" size={'sm'}>
                    <Printer />
                    {print_text()}
                </Button>
            </div>
        ),
        []
    );

    return actionButtons;
}

export default GrnActions;