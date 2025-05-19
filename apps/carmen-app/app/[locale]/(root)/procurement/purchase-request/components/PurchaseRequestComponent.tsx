"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PurchaseRequestList from "./PurchaseRequestList";
import PurchaseRequestGrid from "./PurchaseRequestGrid";
import DialogNewPr from "./DialogNewPr";
import { VIEW } from "@/constants/enum";
import SignInDialog from "@/components/SignInDialog";
import { PurchaseRequestDto } from "@/dtos/pr.dto";
import { useAuth } from "@/context/AuthContext";
import { getAllPr } from "@/services/pr.service";
import ToggleView from "@/components/ui-custom/ToggleView";


const sortFields = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'is_active', label: 'Status' },
    { key: 'exchange_rate', label: 'Exchange Rate' },
];

export default function PurchaseRequestComponent() {
    const { token, tenantId } = useAuth();
    const tCommon = useTranslations('Common');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [view, setView] = useState<VIEW>(VIEW.LIST);
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [prs, setPrs] = useState<PurchaseRequestDto[]>([]);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [page, setPage] = useURL('page');
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (search) {
            setPage('');
        }
    }, [search, setPage]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const result = await getAllPr(token, tenantId, {
                    page,
                    sort,
                    search
                });
                if (result.status === 401) {
                    setLoginDialogOpen(true);
                    return;
                }

                setPrs(result.data);
                setTotalPages(result.paginate.pages);
                setPage(result.paginate.page);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [token, tenantId, page, setPage, sort, search]);


    const title = "Purchase Request";

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const actionButtons = (
        <div className="action-btn-container" data-id="purchase-request-action-buttons">
            <Button size={'sm'} onClick={handleOpenDialog}>
                <Plus className="h-4 w-4" />
                {tCommon('add')} Purchase Request
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="pr-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="pr-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="pr-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="pr-list-search-input"
            />
            <div className="flex items-center gap-2">
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="pr-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <ToggleView view={view} setView={setView} />
            </div>
        </div>
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage.toString());
    };

    const currentPageNumber = parseInt(page || '1');

    const content = view === VIEW.LIST ? (
        <PurchaseRequestList
            purchaseRequests={prs}
            currentPage={currentPageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
        />
    ) : (
        <PurchaseRequestGrid
            purchaseRequests={prs}
            currentPage={currentPageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
        />
    );

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <DialogNewPr open={dialogOpen} onOpenChange={setDialogOpen} />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    );
}
