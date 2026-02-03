"use client";

import { useAuth } from "@/context/AuthContext";
import { useDocumentQuery, useUploadDocument } from "@/hooks/use-doc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function DucumentManagementComponent() {
  const { token, buCode } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadDocument(token, buCode);
  const t = useTranslations("DocumentManagement");
  const tCommon = useTranslations("Common");

  const { docData, pagination, isLoading, error } = useDocumentQuery(token, buCode);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toastSuccess({ message: "Upload success" });
        setFile(null);
        // Clear input value
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      },
      onError: (error) => {
        console.error("Upload error:", error);
        toastError({ message: "Upload failed" });
      },
    });
  };

  return (
    <div className="p-6">
      <pre>{JSON.stringify(docData, null, 2)}</pre>
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={uploadMutation.isPending}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
              {uploadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
