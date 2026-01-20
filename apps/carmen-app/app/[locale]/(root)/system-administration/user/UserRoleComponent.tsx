"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useAssignRoleToUser, useRoleQuery } from "@/hooks/use-role";
import { useUserList } from "@/hooks/useUserList";
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

export default function UserRoleComponent() {
  const { token, buCode } = useAuth();
  const queryClient = useQueryClient();

  const { userList, isLoading: userLoading } = useUserList(token, buCode);
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

  const isLoading = userLoading || roleLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto max-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* User Selection Card */}
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

          {/* Role Selection Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Select Role
                </h2>
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? "Assigning..." : "Assign Role"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
