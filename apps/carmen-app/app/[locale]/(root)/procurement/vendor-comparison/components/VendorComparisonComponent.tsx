"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { mockVendorComparisonData } from "@/mock-data/procurement";
import VendorComparisonList from "./VendorComparisonList";
import { useURL } from "@/hooks/useURL";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import { parseSortString } from "@/utils/table-sort";

export default function VendorComparisonComponent() {
    const tCommon = useTranslations('Common');
    const tVendorComparison = useTranslations("VendorComparison");
    const tDataControls = useTranslations("DataControls");

    const [page, setPage] = useURL("page");
    const [perpage, setPerpage] = useURL("perpage");
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');

    const totalItems = mockVendorComparisonData.length;
    const totalPages = 1;

    useEffect(() => {
        if (search) {
            setPage("");
        }
    }, [search, setPage]);


    const handleSetPerpage = (newPerpage: number) => {
        setPerpage(newPerpage.toString());
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage.toString());
    };


    const title = tVendorComparison("title");

    const sortFields = [
        { key: 'name', label: tCommon("name") },
    ];

    const filters = (
        <div className="filter-container" data-id="vc-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon("search")}
                data-id="vc-list-search-input"
            />

            <div className="flex items-center gap-2">
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="vc-list-sort-dropdown"
                />
                <Button size={"sm"}>
                    <Filter className="h-4 w-4" />
                    {tDataControls("filter")}
                </Button>
            </div>
        </div>
    );

    const actionButtons = (
        <div
            className="action-btn-container"
            data-id="po-action-buttons"
        >
            <Button size={"sm"}>
                <Plus />
                {tCommon("add")} {title}
            </Button>
            <Button
                variant="outlinePrimary"
                className="group"
                size={"sm"}
                data-id="po-list-export-button"
            >
                <FileDown />
                {tCommon("export")}
            </Button>
            <Button variant="outlinePrimary" size={"sm"} data-id="pr-list-print-button">
                <Printer />
                {tCommon("print")}
            </Button>
        </div>
    );

    const content = (
        <VendorComparisonList
            vendorComparisons={mockVendorComparisonData}
            currentPage={page ? parseInt(page) : 1}
            totalPages={totalPages}
            totalItems={totalItems}
            perpage={perpage ? parseInt(perpage) : 10}
            onPageChange={handlePageChange}
            isLoading={false}
            sort={parseSortString(sort)}
            onSort={setSort}
            setPerpage={handleSetPerpage}
        />
    )

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />
    );
}
