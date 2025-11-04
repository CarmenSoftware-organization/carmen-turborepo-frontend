import { BusinessUnitDto } from "@/dto/cluster.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface Props {
  readonly buData: BusinessUnitDto[];
}

export default function TabBu({ buData }: Props) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                <p className="text-muted-foreground">No business units available</p>
              </TableCell>
            </TableRow>
          ) : (
            buData.map((unit) => (
              <TableRow key={unit.id} className="hover:bg-accent/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{unit.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{unit.code}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
