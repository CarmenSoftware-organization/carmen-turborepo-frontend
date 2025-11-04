import { ClusterUserDto, PLATFORM_ROLE, UserProfileDto } from "@/dto/cluster.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code, Headphones, Mail, Settings, Shield, User, UserCog, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPlatformName } from "@/lib/utils";
interface Props {
  readonly userData: ClusterUserDto[];
}

export default function TabBu({ userData }: Props) {
  const getInitials = (firstname: string, lastname: string): string => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "default" : "secondary";
  };

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />;
  };

  const formatName = (profile: UserProfileDto): string => {
    const { firstname, lastname, middlename } = profile;
    return middlename ? `${firstname} ${middlename} ${lastname}` : `${firstname} ${lastname}`;
  };

  const getRolIcon = (role: PLATFORM_ROLE) => {
    switch (role) {
      case PLATFORM_ROLE.SUPER_ADMIN:
        return <Shield className="h-4 w-4" />;
      case PLATFORM_ROLE.PLATFORM_ADMIN:
        return <Settings className="h-4 w-4" />;
      case PLATFORM_ROLE.SUPPORT_MANAGER:
        return <UserCog className="h-4 w-4" />;
      case PLATFORM_ROLE.SUPPORT_STAFF:
        return <Headphones className="h-4 w-4" />;
      case PLATFORM_ROLE.SECURITY_OFFICER:
        return <Lock className="h-4 w-4" />;
      case PLATFORM_ROLE.INTEGRATION_DEVELOPER:
        return <Code className="h-4 w-4" />;
      case PLATFORM_ROLE.USER:
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Platform Role</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <p className="text-muted-foreground">No users available</p>
            </TableCell>
          </TableRow>
        ) : (
          userData.map((clusterUser) => (
            <TableRow key={clusterUser.id} className="hover:bg-accent/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={
                        clusterUser.role === "admin"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {getInitials(
                        clusterUser.user.profile.firstname,
                        clusterUser.user.profile.lastname
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{formatName(clusterUser.user.profile)}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{clusterUser.user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRolIcon(clusterUser.user.platform_role)}
                  {getPlatformName(clusterUser.user.platform_role)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getRoleBadgeVariant(clusterUser.role)}
                  className="flex items-center gap-1 w-fit"
                >
                  {getRoleIcon(clusterUser.role)}
                  <span className="capitalize">{clusterUser.role}</span>
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
