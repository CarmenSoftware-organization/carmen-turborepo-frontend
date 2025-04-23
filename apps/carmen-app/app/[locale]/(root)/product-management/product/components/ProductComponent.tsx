"use client";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/constants/options";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { Link } from "@/lib/navigation";
import { ProductGetDto } from "@/dtos/product.dto";
import { getProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import SignInDialog from "@/components/SignInDialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ProductComponent() {
    const { token, tenantId } = useAuth();
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tProduct = useTranslations('Product');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [products, setProducts] = useState<ProductGetDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (search) {
            setPage('');
        }
    }, [search, setPage]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);

        const fetchProducts = async () => {
            try {
                const data = await getProductService(token, tenantId, {
                    search,
                    sort,
                    page,
                    ...(status ? { filter: status } : {})
                });

                if (!isMounted) return;

                if (data.statusCode === 401) {
                    setLoginDialogOpen(true);
                    return;
                }

                if (data.statusCode === 400) {
                    setError("Invalid request parameters");
                    setProducts([]);
                    setTotalPages(1);
                    return;
                }

                if (data.statusCode && data.statusCode >= 400) {
                    setError(`Error: ${data.message ?? 'Unknown error occurred'}`);
                    setProducts([]);
                    setTotalPages(1);
                    return;
                }

                setProducts(data.data ?? []);
                setTotalPages(data.paginate?.pages ?? 1);
                setError(null);
            } catch (error) {
                if (!isMounted) return;

                console.error("Error fetching products:", error);
                setError("Failed to load products");
                setProducts([]);
                setTotalPages(1);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [token, tenantId, search, sort, page, status]);

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setDeleteDialogOpen(true);
    }

    const confirmDelete = async () => {
        if (!deleteId) return;
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== deleteId)
        );
        setIsDeleting(true);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage.toString());
    };

    const sortFields = [
        { key: 'name', label: tHeader('name') },
        { key: 'category', label: tHeader('category') },
        { key: 'sub_category', label: tHeader('sub_category') },
        { key: 'item_group', label: tHeader('item_group') },
    ];

    const title = tProduct('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="product-list-action-buttons">
            <Button size={'sm'} asChild>
                <Link href="/product-management/product/new">
                    <Plus />
                    {tCommon('add')}
                </Link>
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="delivery-point-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="delivery-point-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="product-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="product-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="product-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="product-list-sort-dropdown"
                />
            </div>
        </div>
    );

    const content = (
        <ProductList
            products={products}
            isLoading={isLoading}
            currentPage={parseInt(page || '1')}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            data-id="product-list-template"
            error={error}
            onDelete={handleDelete}
        />
    );

    return (
        <div>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}