import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface EmptyDataProps {
  readonly message: string;
}

export default function EmptyData({ message }: EmptyDataProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground">{message}</p>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
