import { PlatformUserDto } from "@/dto/user.dto"
import { User, AtSign, Briefcase, CheckCircle2, XCircle, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

interface PlatformUserListProps {
    readonly users: PlatformUserDto[]
}

export default function PlatformUserList({ users }: PlatformUserListProps) {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <ScrollArea className="h-[calc(100vh-240px)]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Business Unit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.bu_name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status ? "outline" : "destructive"}
                                            className="flex items-center gap-1 w-fit"
                                            aria-label={user.status ? "Active" : "Inactive"}
                                        >
                                            {user.status ? (
                                                <>
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3" />
                                                    <span>Inactive</span>
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user?.last_active ? format(user.last_active, "dd MMM yyyy") : "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="grid grid-cols-1 gap-4">
                        {users.map((user) => (
                            <Card key={user.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="font-medium">{user.name}</h2>
                                                <div className="flex items-center text-muted-foreground text-sm">
                                                    <AtSign className="h-3 w-3 mr-1" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={user.status ? "outline" : "destructive"}
                                            className="flex items-center gap-1"
                                            aria-label={user.status ? "Active" : "Inactive"}
                                        >
                                            {user.status ? (
                                                <>
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3" />
                                                    <span>Inactive</span>
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                                        <div>
                                            <span className="text-xs text-muted-foreground">Role</span>
                                            <p className="text-foreground">{user.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                                        <div>
                                            <span className="text-xs text-muted-foreground">Business Unit</span>
                                            <p className="text-foreground">{user.bu_name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}
