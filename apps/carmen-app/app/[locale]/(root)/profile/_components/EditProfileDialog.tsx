"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toastSuccess } from "@/components/ui-custom/Toast";
import { profileFormSchema, ProfileFormValues } from "./ProfileComponent";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface EditProfileDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly profile: {
    readonly id: string;
    readonly email: string;
    readonly user_info: {
      readonly firstname: string;
      readonly middlename?: string;
      readonly lastname: string;
    };
    readonly business_unit: {
      readonly id: string;
      readonly name: string;
      readonly is_default?: boolean;
    }[];
  };
  readonly onSave: (values: ProfileFormValues) => void;
}

export function EditProfileDialog({ open, onOpenChange, profile, onSave }: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("ProfilePage");
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstname: profile.user_info.firstname,
      middlename: profile.user_info.middlename ?? "",
      lastname: profile.user_info.lastname,
      email: profile.email,
    },
  });

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSave(data);
      setIsSubmitting(false);
      onOpenChange(false);
      toastSuccess({ message: t("update_success") });
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit_profile")}</DialogTitle>
          <DialogDescription>{t("edit_profile_description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_your_first_name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middlename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("middleName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_your_middle_name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_your_last_name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter_your_email")} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  t("save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
