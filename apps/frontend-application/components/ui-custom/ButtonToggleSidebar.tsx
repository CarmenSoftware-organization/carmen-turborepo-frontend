"use client";

import React from 'react';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';

interface ToggleSidebarButtonProps {
    toggleSidebar: () => void;
    label: string
}

const ToggleSidebarButton: React.FC<ToggleSidebarButtonProps> = ({ toggleSidebar, label }) => {
    return (
        <Button
            variant="outline"
            onClick={toggleSidebar}
            className='bg-sky-300 hover:bg-sky-200 rounded-xl flex items-center justify-center w-fit px-4 h-10 shadow-lg border group'
        >
            <MessageCircle color='black' />
            <div className='group-hover:block hidden transition-all duration-300 ttext-sky-900'>
                {label}
            </div>
        </Button>
    );
};

export default ToggleSidebarButton;
