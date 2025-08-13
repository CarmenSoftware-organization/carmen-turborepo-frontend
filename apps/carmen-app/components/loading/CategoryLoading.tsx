import { Skeleton } from "../ui/skeleton";

export default function CategoryLoading() {
    const categoryItems = ["cat-1", "cat-2", "cat-3", "cat-4", "cat-5"];
    const subCategoryItems = [
        ["subcat-1-1", "subcat-1-2", "subcat-1-3"],
        ["subcat-2-1", "subcat-2-2", "subcat-2-3"],
        ["subcat-3-1", "subcat-3-2", "subcat-3-3"],
        ["subcat-4-1", "subcat-4-2", "subcat-4-3"],
        ["subcat-5-1", "subcat-5-2", "subcat-5-3"]
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <div className="fxr-c gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-32" />
                </div>
            </div>
            <div className="border rounded-lg p-4 h-[calc(98vh-120px)]">
                {categoryItems.map((id, i) => (
                    <div key={id} className="mb-4">
                        <div className="fxr-c mb-2">
                            <Skeleton className="h-4 w-4 mr-2" />
                            <Skeleton className="h-6 w-full max-w-[250px]" />
                        </div>
                        {i % 2 === 0 && (
                            <div className="ml-8 space-y-2">
                                {subCategoryItems[i].map((subId) => (
                                    <div key={subId} className="fxr-c mb-2">
                                        <Skeleton className="h-4 w-4 mr-2" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
