"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Grid, List, Plus, Printer, Filter } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { VIEW } from "@/constants/enum";
import RecipeList from "./RecipeList";
import RecipeGrid from "./RecipeGrid";
import { fetchRecipe } from "@/services/operational-planning.service";
import { RecipeDto } from "@/dtos/operational-planning.dto";

export default function RecipeComponent() {
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [view, setView] = useState<VIEW>(VIEW.GRID);
    const [recipe, setRecipe] = useState<RecipeDto[]>([]);
    const [limit, setLimit] = useURL('limit', { defaultValue: '10' });
    const [skip, setSkip] = useURL('skip', { defaultValue: '0' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSkip = (page: number) => {
        const newSkip = (page - 1) * Number(limit);
        setSkip(newSkip.toString());
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchRecipe(`limit=${limit || '10'}&skip=${skip || '0'}`);
                setRecipe(response.recipes);
                setTotalPages(Math.ceil(response.total / Number(limit)));
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [limit, skip]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'rating', label: 'Rating' },
        { key: 'timeTotal', label: 'Time' },
    ];

    const title = "Recipe Management";

    const actionButtons = (
        <div className="flex items-center gap-2" data-id="recipe-action-buttons">
            <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                data-id="recipe-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                data-id="recipe-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full" data-id="recipe-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="recipe-search-input"
            />
            <div className="flex flex-wrap items-center gap-2 ml-auto">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="recipe-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="recipe-sort-dropdown"
                />
                <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                        variant={view === VIEW.LIST ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView(VIEW.LIST)}
                        className="rounded-none h-9"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === VIEW.GRID ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView(VIEW.GRID)}
                        className="rounded-none h-9"
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    {tCommon('filter')}
                </Button>
            </div>
        </div>
    );

    const content = (
        <div className="space-y-6">
            {view === VIEW.LIST && (
                <RecipeList 
                    data={recipe} 
                    isLoading={isLoading} 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    handleSkip={handleSkip} 
                />
            )}
            {view === VIEW.GRID && (
                <RecipeGrid 
                    data={recipe} 
                    isLoading={isLoading} 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    handleSkip={handleSkip} 
                />
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Show</span>
                    <select 
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <span>per page</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSkip(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {(() => {
                            // Show first page, last page, current page, and pages around current
                            const pages = [];
                            if (totalPages <= 5) {
                                // If 5 or fewer pages, show all
                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                                // Always include first page
                                pages.push(1);
                                
                                // Calculate range around current page
                                let startPage = Math.max(2, currentPage - 1);
                                let endPage = Math.min(totalPages - 1, currentPage + 1);
                                
                                // Adjust if at edges
                                if (currentPage <= 2) {
                                    endPage = 3;
                                } else if (currentPage >= totalPages - 1) {
                                    startPage = totalPages - 2;
                                }
                                
                                // Add ellipsis if needed
                                if (startPage > 2) pages.push(-1); // -1 represents ellipsis
                                
                                // Add range pages
                                for (let i = startPage; i <= endPage; i++) pages.push(i);
                                
                                // Add ellipsis if needed
                                if (endPage < totalPages - 1) pages.push(-2); // -2 represents ellipsis
                                
                                // Always include last page
                                if (totalPages > 1) pages.push(totalPages);
                            }
                            
                            return pages.map(page => 
                                page < 0 ? (
                                    <span key={`ellipsis-${page}`} className="px-2">...</span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleSkip(page)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                )
                            );
                        })()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSkip(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />
    );
}


