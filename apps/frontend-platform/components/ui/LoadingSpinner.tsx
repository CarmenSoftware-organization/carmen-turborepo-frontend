import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <div className="relative h-12 w-12">
                <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default LoadingSpinner; 