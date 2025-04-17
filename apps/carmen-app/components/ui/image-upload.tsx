"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface ImageUploadProps {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const ImageUpload = ({
    value,
    onChange,
    disabled
}: ImageUploadProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            // TODO: Implement actual image upload logic here
            // For now, we'll just create a URL for the selected file
            const imageUrl = URL.createObjectURL(file);
            onChange?.(imageUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                    {value ? (
                        <Image
                            src={value}
                            alt="Uploaded"
                            className="w-full h-full object-cover rounded-lg"
                            width={1920}
                            height={1080}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={disabled || isLoading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload">
                        <Button
                            type="button"
                            variant="outline"
                            className={cn(
                                "w-full",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={disabled || isLoading}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isLoading ? "Uploading..." : "Upload Image"}
                        </Button>
                    </label>
                </div>
            </div>
        </div>
    );
}; 