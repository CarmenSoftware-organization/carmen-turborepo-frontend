import React from "react";

interface Props {
    title?: string;
    description?: string;
}

const EmptyData: React.FC<Props> = ({
    title = "No Data Available",
    description = "We couldn't find any data to display at the moment. Please check back later or try refreshing the page.",
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2">{description}</p>
        </div>
    );
};

export default EmptyData;
