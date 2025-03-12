import React, { MouseEvent } from 'react';

interface RippleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const RippleButton: React.FC<RippleButtonProps> = ({ children, onClick, className }) => {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add("ripple-effect");

        button.appendChild(ripple);

        ripple.addEventListener("animationend", () => {
            ripple.remove();
        });

        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`relative overflow-hidden font-semibold py-2 px-4 rounded focus:outline-none focus:ring transition-all duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default RippleButton;
