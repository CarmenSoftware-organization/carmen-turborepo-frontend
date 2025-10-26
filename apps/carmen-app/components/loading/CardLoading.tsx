import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMemo } from "react";

interface Props {
    readonly items: number
}

export default function CardLoading({ items }: Props) {
    const skeletonItems = useMemo(() =>
        Array.from({ length: items }, (_, i) => `skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`),
        [items]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skeletonItems.map((id) => (
                <Card key={id} className="animate-pulse">
                    <CardHeader className="p-2">
                        <div className="h-6 bg-muted-foreground/20 rounded"></div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                        <div className="h-4 bg-muted-foreground/20 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-8 bg-muted-foreground/20 rounded"></div>
                            <div className="h-8 bg-muted-foreground/20 rounded"></div>
                            <div className="h-8 bg-muted-foreground/20 rounded"></div>
                            <div className="h-8 bg-muted-foreground/20 rounded"></div>
                        </div>
                    </CardContent>
                    <div className="p-2">
                        <div className="h-6 bg-muted-foreground/20 rounded w-24 ml-auto"></div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
