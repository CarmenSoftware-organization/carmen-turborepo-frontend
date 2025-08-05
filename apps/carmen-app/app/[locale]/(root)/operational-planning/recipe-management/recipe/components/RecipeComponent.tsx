"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Grid, List, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { VIEW } from "@/constants/enum";
import { fetchRecipe } from "@/services/operational-planning.service";
import { RecipeDto } from "@/dtos/operational-planning.dto";
import RecipeList from "./RecipeList";
import RecipeGrid from "./RecipeGrid";

export default function RecipeComponent() {
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [view, setView] = useState<VIEW>(VIEW.GRID);
    const [recipe, setRecipe] = useState<RecipeDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetchRecipe(`limit=10&skip=0`);
                setRecipe(response.recipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
    ];

    const title = "Recipe";

    const actionButtons = (
        <div className="action-btn-container" data-id="recipe-action-buttons">
            <Button size={'sm'}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="recipe-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="recipe-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="recipe-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="recipe-search-input"
            />
            <div className="flex items-center gap-2">
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
                <Button
                    variant={view === VIEW.LIST ? 'default' : 'outline'}
                    size={'sm'}
                    onClick={() => setView(VIEW.LIST)}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={view === VIEW.GRID ? 'default' : 'outline'}
                    size={'sm'}
                    onClick={() => setView(VIEW.GRID)}
                >
                    <Grid className="h-4 w-4" />
                </Button>

                <Button size={'sm'}>
                    Add Filter
                </Button>
            </div>
        </div>
    );

    const content = (
        <div className="space-y-2">
            {view === VIEW.LIST && <RecipeList data={recipe} isLoading={isLoading} />}
            {view === VIEW.GRID && <RecipeGrid data={recipe} isLoading={isLoading} />}
        </div>
    )

    return <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
    />
}


