"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code, CrownIcon, Info, List, Share2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useCluster } from "@/app/hooks/useCluster";
import { useDeleteBu } from "@/app/hooks/useBu";
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
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  readonly buData: IBuDto[];
}

export default function BuList({ buData }: Props) {
  const { getClusterName } = useCluster();
  const deleteBu = useDeleteBu();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buToDelete, setBuToDelete] = useState<IBuDto | null>(null);

  const handleDeleteClick = (bu: IBuDto) => {
    setBuToDelete(bu);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!buToDelete) return;

    try {
      await deleteBu.mutateAsync(buToDelete.id);
      toast.success("Business unit deleted successfully!");
      setDeleteDialogOpen(false);
      setBuToDelete(null);
    } catch (error) {
      console.error("Error deleting business unit:", error);
      toast.error(
        `Failed to delete business unit: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-14">#</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>Name</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>Code</span>
              </div>
            </TableHead>

            <TableHead>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span>Cluster</span>
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-2">
                <CrownIcon className="w-4 h-4" />
                <span>Headquarter</span>
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Info className="w-4 h-4" />
                <span>Status</span>
              </div>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buData?.map((bu: IBuDto, index: number) => (
            <TableRow key={bu.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <Link
                  href={`/business/${bu.id}`}
                  className="cursor-pointer hover:text-primary hover:underline"
                >
                  {bu.name}
                </Link>
              </TableCell>
              <TableCell>{bu.code}</TableCell>
              <TableCell>{getClusterName(bu.cluster_id)}</TableCell>
              <TableCell className="text-center">{bu.is_hq ? "HQ" : "Branch"}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <Badge variant="outline" className="gap-1.5 border-none">
                    <span
                      className={cn(
                        bu.is_active ? "bg-green-500" : "bg-red-500",
                        "size-1.5 rounded-full"
                      )}
                      aria-hidden="true"
                    />
                    {bu.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent hover:text-destructive"
                        onClick={() => handleDeleteClick(bu)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business unit &quot;
              {buToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
