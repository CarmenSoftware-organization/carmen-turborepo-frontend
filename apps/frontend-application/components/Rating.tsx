import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

type RatingProps = {
    maxStars?: number;
    initialRating?: number;
    onRatingChange?: (rating: number) => void;
};

const Rating: React.FC<RatingProps> = ({
    maxStars = 5,
    initialRating = 0,
    onRatingChange,
}) => {
    const [rating, setRating] = useState(initialRating);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleRating = (newRating: number) => {
        setRating(newRating);
        if (onRatingChange) {
            onRatingChange(newRating);
        }
    };

    return (
        <div className="flex space-x-1">
            {Array.from({ length: maxStars }, (_, index) => {
                const starNumber = index + 1;
                let colorClass = 'text-gray-300'; // Default empty star

                if (starNumber <= rating) {
                    colorClass = 'text-yellow-400'; // Full star
                } else if (starNumber - 0.5 <= rating) {
                    colorClass = 'text-yellow-400 half-star'; // Half star
                }

                return (
                    <Star
                        key={index}
                        className={`cursor-pointer transition-colors ${colorClass}`}
                        onClick={() => handleRating(starNumber)}
                    />
                );
            })}
        </div>
    );
};

export default Rating;
