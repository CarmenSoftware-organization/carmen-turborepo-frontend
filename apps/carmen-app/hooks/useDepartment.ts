import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { DepartmentDto } from "@/dtos/config.dto";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
} from "@/services/department.service";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export const useDepartment = () => {
  const { token, tenantId } = useAuth();
  const tDepartment = useTranslations("Department");
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<
    DepartmentDto | undefined
  >();
  const [page, setPage] = useURL("page");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllDepartments(token, tenantId, {
        search,
        sort,
        page,
        filter,
      });

      if (data.message === "Token or tenantId is missing") {
        console.warn("API response: Token or tenantId is missing");
        setDepartments([]);
        setTotalPages(1);
        return;
      }

      if (data.status === 401) {
        setLoginDialogOpen(true);
        return;
      }
      setDepartments(data.data ?? []);
      setTotalPages(data.paginate?.pages ?? 1);
    } catch (error) {
      console.error("Error fetching departments:", error);

      if (error instanceof Error) {
        toastError({ message: `Error: ${error.message}` });
      } else {
        toastError({ message: "Error fetching departments" });
      }

      setDepartments([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [token, tenantId, search, sort, page, filter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage.toString());
    },
    [setPage]
  );

  const sortFields = [
    { key: "name", label: tDepartment("department_name") },
    { key: "is_active", label: tDepartment("department_status") },
  ];

  const handleAdd = useCallback(() => {
    setSelectedDepartment(undefined);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((department: DepartmentDto) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  }, []);

  const handleStatusChange = useCallback((department: DepartmentDto) => {
    setSelectedDepartment(department);
    setStatusDialogOpen(true);
  }, []);

  const handleConfirmStatusChange = useCallback(async () => {
    if (!selectedDepartment?.id || !token || !tenantId) return;

    try {
      const updatedDepartment = {
        ...selectedDepartment,
        is_active: !selectedDepartment.is_active,
      };
      const result = await updateDepartment(token, tenantId, updatedDepartment);
      if (result) {
        setDepartments((prevDepartments) =>
          prevDepartments.map((dp) =>
            dp.id === selectedDepartment.id
              ? { ...dp, is_active: !dp.is_active }
              : dp
          )
        );
        toastSuccess({
          message: `Department ${!selectedDepartment.is_active ? "activated" : "deactivated"} successfully`,
        });
        setStatusDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating department status:", error);
      toastError({ message: "Error updating department status" });
    }
  }, [selectedDepartment, token, tenantId]);

  const handleSubmit = useCallback(
    async (data: DepartmentDto) => {
      try {
        if (selectedDepartment) {
          const updatedDepartment = { ...data, id: selectedDepartment.id };
          const result = await updateDepartment(
            token,
            tenantId,
            updatedDepartment
          );
          if (result) {
            setDepartments((prevDepartments) =>
              prevDepartments.map((dp) =>
                dp.id === selectedDepartment.id ? updatedDepartment : dp
              )
            );
            toastSuccess({ message: "Department updated successfully" });
          }
        } else {
          const result = await createDepartment(token, tenantId, data);
          const newDepartment: DepartmentDto = {
            ...data,
            id: result.id,
          };
          setDepartments((prevDepartments) => [
            ...prevDepartments,
            newDepartment,
          ]);
          toastSuccess({ message: "Department created successfully" });
        }
        setDialogOpen(false);
        setSelectedDepartment(undefined);
      } catch (error) {
        console.error("Error handling department submission:", error);
        toastError({ message: "Error handling department submission" });
      }
    },
    [selectedDepartment, token, tenantId]
  );

  const getDepartmentName = useCallback(
    (departmentId: string) => {
      const department = departments.find((dp) => dp.id === departmentId);
      return department?.name ?? "";
    },
    [departments]
  );

  return {
    // State
    search,
    setSearch,
    filter,
    setFilter,
    statusOpen,
    setStatusOpen,
    sort,
    setSort,
    departments,
    isLoading,
    dialogOpen,
    setDialogOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    loginDialogOpen,
    setLoginDialogOpen,
    selectedDepartment,
    page,
    totalPages,

    // Functions
    handlePageChange,
    sortFields,
    handleAdd,
    handleEdit,
    handleStatusChange,
    handleConfirmStatusChange,
    handleSubmit,
    fetchDepartments,
    getDepartmentName,
  };
};
