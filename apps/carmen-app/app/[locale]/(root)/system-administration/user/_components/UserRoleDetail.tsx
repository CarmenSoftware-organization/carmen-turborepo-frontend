"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Shield, ArrowLeft, Save, Loader2, AtSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/lib/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useRoleQuery, useUpdateUserRoles, roleKeyDetails } from "@/hooks/use-role";
import { useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { RoleDto } from "@/dtos/role.dto";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import LoadingUserRole from "./LoadingUserRole";

interface UserRoleData {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  application_roles: { application_role_id: string }[];
}

const userRoleFormSchema = z.object({
  user_id: z.string().min(1),
  role_ids: z.array(z.string()),
});

type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

interface UserRoleDetailProps {
  readonly dataUser: UserRoleData | undefined;
  readonly isLoading: boolean;
  readonly isError: boolean;
}

export default function UserRoleDetail({ dataUser, isLoading, isError }: UserRoleDetailProps) {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();
  const t = useTranslations("UserRole");
  const { roles, isLoading: rolesLoading } = useRoleQuery({ token, buCode });
  const { mutate: updateUserRoles, isPending } = useUpdateUserRoles(token, buCode);

  const initialRoleIds = useMemo(() => {
    if (!dataUser?.application_roles) return [];
    return dataUser.application_roles.map((role) => role.application_role_id);
  }, [dataUser?.application_roles]);

  const initName = () => {
    const info = dataUser;
    if (!info) return "U";
    const cleanName = (name: string) => {
      const leadingVowels = /^[เแโใไ]/;
      return name?.trim().replace(leadingVowels, "") || "";
    };

    const first = cleanName(info.firstname)[0] || "";
    const last = cleanName(info.lastname)[0] || "";

    return (first + last).toUpperCase() || "U";
  };

  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: {
      user_id: "",
      role_ids: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (dataUser) {
      reset({
        user_id: dataUser.user_id || "",
        role_ids: initialRoleIds,
      });
    }
  }, [dataUser, initialRoleIds, reset]);

  const onSubmit = useCallback(
    (data: UserRoleFormValues) => {
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
          toastSuccess({ message: t("update_success") });
          queryClient.invalidateQueries({ queryKey: [roleKeyDetails, data.user_id] });
        },
        onError: () => {
          toastError({ message: t("update_failed") });
        },
      });
    },
    [initialRoleIds, updateUserRoles, queryClient, t]
  );

  if (isLoading) {
    return <LoadingUserRole />;
  }

  if (isError || !dataUser) {
    return (
      <div className="space-y-4">
        <Link href="/system-administration/user">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        </Link>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("user_not_found")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <Link href="/system-administration/user">
            <Button variant="ghost" size="sm" className="gap-2" type="button">
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Button>
          </Link>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? t("saving") : t("save")}
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16 text-lg">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {initName()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg font-semibold tracking-tight">
                  {dataUser.firstname} {dataUser.lastname}
                </h2>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <p className="text-sm break-all">{dataUser.email}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AtSign className="h-3 w-3" />
                  Username
                </div>
                <p className="text-sm break-all">{dataUser.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">{t("assign_roles")}</h2>
            </div>
          </CardHeader>
          <CardContent>
            {rolesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="role_ids"
                render={() => (
                  <FormItem>
                    <div className="grid gap-2">
                      {roles?.map((role: RoleDto) => (
                        <FormField
                          key={role.id}
                          control={form.control}
                          name="role_ids"
                          render={({ field }) => {
                            const isChecked = field.value?.includes(role.id);
                            return (
                              <FormItem className="space-y-0">
                                <FormLabel
                                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                                    isChecked
                                      ? "border-primary/50 bg-primary/5"
                                      : "hover:bg-muted/50"
                                  }`}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
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
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-sm font-normal">
                                      {role.application_role_name || role.name}
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            );
                          }}
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
