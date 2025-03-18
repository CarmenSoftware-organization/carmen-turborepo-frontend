import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterCluster() {
    return (
        <div className="flex items-center justify-between gap-4">
            <Input placeholder="Search" className="w-1/2" />

            <div className="flex gap-2 w-1/2">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Hotel Group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="cluster">Cluster</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="cluster">Cluster</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="cluster">Cluster</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}
