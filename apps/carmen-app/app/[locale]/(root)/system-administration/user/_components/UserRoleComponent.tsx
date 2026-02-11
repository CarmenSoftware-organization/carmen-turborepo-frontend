"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserList } from "@/hooks/useUserList";
import { useTranslations } from "next-intl";
import { ColumnDef, getCoreRowModel, useReactTable, PaginationState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useListPageState } from "@/hooks/use-list-page-state";
import { User, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

interface UserDto {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function UserRoleComponent() {
  const { token, buCode } = useAuth();
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const { pageNumber: currentPage, perpageNumber: perpageValue, setPage, setPerpage } = useListPageState();

  const { userList, isLoading, error } = useUserList(token, buCode, {
    page: currentPage,
    perpage: perpageValue,
  });

  const totalPages = 1;
  const totalItems = 0;

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpageValue,
    }),
    [currentPage, perpageValue]
  );

  const columns = useMemo<ColumnDef<UserDto>[]>(
    () => [
      {
        id: "no",
        header: () => <span className="text-center">#</span>,
        cell: ({ row }) => (
          <span className="text-center">{(currentPage - 1) * perpageValue + row.index + 1}</span>
        ),
        enableSorting: false,
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "firstname",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("name")}
            icon={<User className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>
            {row.original.firstname} {row.original.lastname}
          </span>
        ),
        enableSorting: false,
        size: 250,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("email")}
            icon={<Mail className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
        enableSorting: false,
        size: 300,
      },
      {
        id: "action",
        header: () => <span className="text-center">{t("action")}</span>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Link href={`/system-administration/user/${row.original.user_id}`}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ),
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
    ],
    [t, currentPage, perpageValue]
  );

  const table = useReactTable({
    data: userList ?? [],
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.user_id,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      setPage((newPagination.pageIndex + 1).toString());
      setPerpage(newPagination.pageSize.toString());
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  return (
    <DataGrid
      table={table}
      recordCount={totalItems}
      isLoading={isLoading}
      loadingMode="skeleton"
      emptyMessage={tCommon("no_data")}
      tableLayout={{
        headerSticky: true,
        dense: false,
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
      }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea className="max-h-[calc(100vh-250px)]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        {/* <DataGridPagination sizes={[5, 10, 25, 50, 100]} /> */}
      </div>
    </DataGrid>
  );
}

/*
// ============ COMMENTED FORM CODE - DO NOT DELETE ============
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAssignRoleToUser, useRoleQuery } from "@/hooks/use-role";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { UserPlus, Shield, Save } from "lucide-react";
import { RoleDto } from "@/dtos/role.dto";

const assignUserRoleSchema = z.object({
  user_id: z.string().min(1, "Please select a user"),
  application_role_id: z.string().min(1, "Please select a role"),
});

type AssignUserRoleFormValues = z.infer<typeof assignUserRoleSchema>;

// Inside component:
const queryClient = useQueryClient();
const { roles, isLoading: roleLoading } = useRoleQuery({ token, buCode });
const { mutate: assignRoles, isPending } = useAssignRoleToUser(token, buCode);

const form = useForm<AssignUserRoleFormValues>({
  resolver: zodResolver(assignUserRoleSchema),
  defaultValues: {
    user_id: "",
    application_role_id: "",
  },
});

const onSubmit = (data: AssignUserRoleFormValues) => {
  assignRoles(
    { user_id: data.user_id, application_role_id: data.application_role_id },
    {
      onSuccess: () => {
        toastSuccess({ message: "Role assigned successfully" });
        queryClient.invalidateQueries({ queryKey: ["users", buCode] });
        form.reset();
      },
      onError: (error) => {
        console.error("Error assigning role:", error);
        toastError({ message: "Failed to assign role" });
      },
    }
  );
};

// Form JSX:
<div className="space-y-4 mx-auto max-w-3xl">
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Assign Role to User
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select User</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userList?.map((user: any) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold leading-none tracking-tight">Select Role</h2>
          </div>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="application_role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles?.map((role: RoleDto) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.application_role_name || role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? "Assigning..." : "Assign Role"}
        </Button>
      </div>
    </form>
  </Form>
</div>
// ============ END COMMENTED FORM CODE ============
*/
