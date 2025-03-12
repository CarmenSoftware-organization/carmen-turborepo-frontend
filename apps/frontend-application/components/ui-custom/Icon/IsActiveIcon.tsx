import { Check, X } from 'lucide-react';
import React from 'react';

interface Props {
    isChecked: boolean
}

const IsActiveIcon: React.FC<Props> = ({ isChecked }) => {
    return (
        <div className={`inline-flex items-center justify-center w-6 h-6 ${isChecked ? 'bg-green-500' : 'bg-gray-200'} rounded-full`}>
            {isChecked ? <Check className="text-white" size={16} /> : <X className="text-white" size={16} />}
        </div>
    );
};

export default IsActiveIcon;
