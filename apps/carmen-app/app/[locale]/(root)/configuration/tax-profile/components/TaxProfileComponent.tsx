"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquarePen, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { taxProfileMock } from "./mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
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
import { TaxProfileFormData } from "@/dtos/tax-profile.dto";

export function TaxProfileComponent() {
  const [taxProfiles, setTaxProfiles] = useState(taxProfileMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [deleteProfileId, setDeleteProfileId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaxProfileFormData>({
    defaultValues: {
      name: "",
      tax_rate: 0,
      is_active: true,
    },
  });

  const handleCreate = (data: TaxProfileFormData) => {
    const newProfile = {
      id: crypto.randomUUID(),
      ...data,
    };
    setTaxProfiles((prev) => [...prev, newProfile]);
    setIsDialogOpen(false);
    reset();
  };

  const handleEdit = (profileId: string) => {
    const profile = taxProfiles.find((p) => p.id === profileId);
    if (profile) {
      setValue("name", profile.name);
      setValue("tax_rate", profile.tax_rate);
      setValue("is_active", profile.is_active);
      setEditingProfile(profileId);
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = (data: TaxProfileFormData) => {
    if (editingProfile) {
      setTaxProfiles((prev) =>
        prev.map((profile) =>
          profile.id === editingProfile ? { ...profile, ...data } : profile
        )
      );
      setIsDialogOpen(false);
      setEditingProfile(null);
      reset();
    }
  };

  const handleDelete = (profileId: string) => {
    setTaxProfiles((prev) =>
      prev.filter((profile) => profile.id !== profileId)
    );
    setDeleteProfileId(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    reset();
  };

  const onSubmit = (data: TaxProfileFormData) => {
    if (editingProfile) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tax Profile</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfile
                  ? "Edit Tax Profile"
                  : "Add Tax Profile"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Please enter name" })}
                  placeholder="e.g. VAT 7%"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  {...register("tax_rate", {
                    required: "Please enter tax rate",
                    min: {
                      value: 0,
                      message: "Tax rate must be greater than or equal to 0",
                    },
                  })}
                  placeholder="0"
                />
                {errors.tax_rate && (
                  <p className="text-sm text-red-600">
                    {errors.tax_rate.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={watch("is_active")}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProfile ? "Save" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taxProfiles.map((profile) => (
          <Card
            key={profile.id}
            className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {profile.name}
                </CardTitle>
                <Badge variant={profile.is_active ? "active" : "inactive"}>
                  {profile.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Tax Rate: {profile.tax_rate}%
              </div>
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(profile.id)}
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-destructive"
                  onClick={() => setDeleteProfileId(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={deleteProfileId !== null}
        onOpenChange={() => setDeleteProfileId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Tax Profile? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProfileId && handleDelete(deleteProfileId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
