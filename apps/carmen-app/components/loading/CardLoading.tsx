import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMemo } from "react";


export default function CardLoading() {
    const skeletonItems = useMemo(() =>
        Array(8).fill(0).map((_, i) => `skeleton-${i}-${Math.random().toString(36).substring(2, 9)}`),
        []
    );

    return (
        <>
            {skeletonItems.map((id) => (
                <Card key={id} className="animate-pulse">
                    <CardHeader className="p-2 border-b bg-muted">
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
                    <div className="p-2 border-t bg-muted">
                        <div className="h-6 bg-muted-foreground/20 rounded w-24 ml-auto"></div>
                    </div>
                </Card>
            ))}
        </>
    )
}
