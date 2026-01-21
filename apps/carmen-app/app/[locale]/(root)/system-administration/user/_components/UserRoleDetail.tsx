"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, ArrowLeft, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useRoleQuery, useUpdateUserRoles, roleKeyDetails } from "@/hooks/use-role";
import { useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { RoleDto } from "@/dtos/role.dto";

const userRoleFormSchema = z.object({
  user_id: z.string().min(1),
  role_ids: z.array(z.string()),
});

type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

interface UserRoleDetailProps {
  readonly dataUser: any;
  readonly isLoading: boolean;
  isError: boolean;
}

export default function UserRoleDetail({ dataUser, isLoading, isError }: UserRoleDetailProps) {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const { roles, isLoading: rolesLoading } = useRoleQuery({ token, buCode });
  const { mutate: updateUserRoles, isPending } = useUpdateUserRoles(token, buCode);

  const initialRoleIds = useMemo(() => {
    if (!dataUser?.application_roles) return [];
    return dataUser.application_roles.map(
      (role: { application_role_id: string }) => role.application_role_id
    );
  }, [dataUser?.application_roles]);

  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: {
      user_id: "",
      role_ids: [],
    },
  });

  useEffect(() => {
    if (dataUser) {
      form.reset({
        user_id: dataUser.user_id || "",
        role_ids: initialRoleIds,
      });
    }
  }, [dataUser, initialRoleIds, form]);

  const onSubmit = (data: UserRoleFormValues) => {
    const currentRoleIds = data.role_ids;
    const addRoles = currentRoleIds.filter((id) => !initialRoleIds.includes(id));
    const removeRoles = initialRoleIds.filter((id: string) => !currentRoleIds.includes(id));

    const payload = {
      user_id: data.user_id,
      application_role_id: {
        ...(addRoles.length > 0 && { add: addRoles }),
        ...(removeRoles.length > 0 && { remove: removeRoles }),
      },
    };

    updateUserRoles(payload, {
      onSuccess: () => {
        toastSuccess({ message: "Roles updated successfully" });
        queryClient.invalidateQueries({ queryKey: [roleKeyDetails, data.user_id] });
      },
      onError: (error) => {
        console.error("Error updating roles:", error);
        toastError({ message: "Failed to update roles" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !dataUser) {
    return (
      <div className="space-y-4">
        <Link href="/system-administration/user">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            User not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/system-administration/user">
            <Button variant="ghost" size="sm" className="gap-2" type="button">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <Button type="submit" disabled={isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  {dataUser.firstname} {dataUser.lastname}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{dataUser.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{dataUser.username}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold leading-none tracking-tight">Assign Roles</h2>
            </div>
          </CardHeader>
          <CardContent>
            {rolesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="role_ids"
                render={() => (
                  <FormItem>
                    <div className="space-y-3">
                      {roles?.map((role: RoleDto) => (
                        <FormField
                          key={role.id}
                          control={form.control}
                          name="role_ids"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, role.id]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter((value) => value !== role.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {role.application_role_name || role.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
