"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useDocumentQuery,
  useUploadDocument,
  useDeleteDocument,
  queryKeyDocument,
} from "@/hooks/use-doc";
import { useURL } from "@/hooks/useURL";
import { Loader2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import ListDocument from "./ListDocument";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { DocumentDto } from "@/dtos/doc.dto";

export default function DocumentManagementComponent() {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const t = useTranslations("DocumentManagement");

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentDto | undefined>(undefined);

  const { documents, isLoading } = useDocumentQuery({
    token,
    buCode,
    params: {
      search,
      sort,
      page: page ? Number(page) : 1,
      perpage: perpage ? Number(perpage) : 10,
    },
  });

  const uploadMutation = useUploadDocument(token, buCode);
  const { mutate: deleteDocument } = useDeleteDocument(token, buCode);

  const documentsData: DocumentDto[] = documents?.data ?? [];
  const currentPage = documents?.paginate?.page ?? 1;
  const totalPages = documents?.paginate?.pages ?? 1;
  const totalItems = documents?.paginate?.total ?? documents?.data?.length ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const refetchDocuments = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeyDocument],
      exact: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toastSuccess({ message: t("upload_success") });
        if (fileInputRef.current) fileInputRef.current.value = "";
        refetchDocuments();
      },
      onError: () => {
        toastError({ message: t("upload_failed") });
      },
    });
  };

  const handleDelete = (doc: DocumentDto) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete?.fileToken) {
      deleteDocument(documentToDelete.fileToken, {
        onSuccess: () => {
          toastSuccess({ message: t("delete_success") });
          refetchDocuments();
          setDeleteDialogOpen(false);
          setDocumentToDelete(undefined);
        },
        onError: () => {
          toastError({ message: t("delete_failed") });
        },
      });
    }
  };

  const sortFields = [
    { key: "originalName", label: t("file_name") },
    { key: "size", label: t("size") },
    { key: "lastModified", label: t("last_modified") },
  ];

  const title = t("title");

  const actionButtons = (
    <div className="flex items-center gap-2" data-id="document-list-action-buttons">
      <Button
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {t("upload")}
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploadMutation.isPending}
      />
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="document-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={t("search")}
        data-id="document-list-search-input"
      />
      <div className="fxr-c gap-2">
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="document-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListDocument
      documents={documentsData}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onDelete={handleDelete}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      perpage={documents?.paginate?.perpage ?? 10}
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
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t("delete_document")}
        description={t("delete_confirm", { name: documentToDelete?.originalName ?? "" })}
      />
    </>
  );
}
