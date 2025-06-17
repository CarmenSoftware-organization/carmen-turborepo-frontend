import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLocationValues } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserBasicInfo {
  id: string;
  name: string;
}

interface LocationUserProps {
  readonly initCurrentUsers: UserBasicInfo[];
  readonly initAvailableUsers: UserBasicInfo[];
  readonly mode: formType;
  readonly formControl: Control<FormLocationValues>;
}

export default function LocationUser({
  initCurrentUsers,
  initAvailableUsers,
  mode,
  formControl,
}: LocationUserProps) {
  const { field } = useController({
    name: "users",
    control: formControl,
  });

  const [currentUsers, setCurrentUsers] =
    useState<UserBasicInfo[]>(initCurrentUsers);

  const [availableUsers, setAvailableUsers] =
    useState<UserBasicInfo[]>(initAvailableUsers);

  useEffect(() => {
    // กรองผู้ใช้ที่ไม่ซ้ำกับ currentUsers
    const filteredAvailableUsers = initAvailableUsers.filter(
      (availableUser) =>
        !currentUsers.some((currentUser) => currentUser.id === availableUser.id)
    );
    setAvailableUsers(filteredAvailableUsers);
  }, [initAvailableUsers, currentUsers]);

  console.log("availableUsers", availableUsers);

  const [selectedLocationUsers, setSelectedLocationUsers] = useState<string[]>(
    []
  );
  const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<
    string[]
  >([]);

  useEffect(() => {
    const removedUsers = initCurrentUsers
      .filter((initUser) =>
        availableUsers.some((user) => user.id === initUser.id)
      )
      .map((user) => ({ id: user.id }));

    const addedUsers = currentUsers
      .filter((user) =>
        initAvailableUsers.some((initUser) => initUser.id === user.id)
      )
      .map((user) => ({ id: user.id }));

    field.onChange({
      add: addedUsers,
      remove: removedUsers,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsers, availableUsers]);

  const isReadOnly = mode === formType.VIEW;

  const handleSelectAllLocationUsers = (checked: boolean) => {
    if (checked) {
      setSelectedLocationUsers(currentUsers.map((user) => user.id));
    } else {
      setSelectedLocationUsers([]);
    }
  };

  const handleSelectAllAvailableUsers = (checked: boolean) => {
    if (checked) {
      setSelectedAvailableUsers(availableUsers.map((user) => user.id));
    } else {
      setSelectedAvailableUsers([]);
    }
  };

  const handleSelectLocationUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocationUsers([...selectedLocationUsers, userId]);
    } else {
      setSelectedLocationUsers(
        selectedLocationUsers.filter((id) => id !== userId)
      );
    }
  };

  const handleSelectAvailableUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableUsers([...selectedAvailableUsers, userId]);
    } else {
      setSelectedAvailableUsers(
        selectedAvailableUsers.filter((id) => id !== userId)
      );
    }
  };

  const handleMoveToAvailable = () => {
    const usersToMove = currentUsers.filter((user) =>
      selectedLocationUsers.includes(user.id)
    );
    setAvailableUsers([...availableUsers, ...usersToMove]);
    setCurrentUsers(
      currentUsers.filter((user) => !selectedLocationUsers.includes(user.id))
    );
    setSelectedLocationUsers([]);
  };

  const handleMoveToLocation = () => {
    const usersToMove = availableUsers.filter((user) =>
      selectedAvailableUsers.includes(user.id)
    );
    setCurrentUsers([...currentUsers, ...usersToMove]);
    setAvailableUsers(
      availableUsers.filter((user) => !selectedAvailableUsers.includes(user.id))
    );
    setSelectedAvailableUsers([]);
  };

  return (
    <Card className="w-full max-w-6xl p-6">
      <div className="flex flex-row justify-between gap-8">
        <div className="flex-1 flex flex-col min-w-[400px]">
          <CardHeader className="px-0 pt-0">
            <h1 className="text-xl font-semibold">Location Users</h1>
            <p className="text-sm text-muted-foreground">
              Current users in this location
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        id="select-location-users-all"
                        onCheckedChange={(checked) =>
                          handleSelectAllLocationUsers(checked as boolean)
                        }
                        checked={
                          selectedLocationUsers.length === currentUsers.length
                        }
                        disabled={isReadOnly}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-[50px]">
                        <Checkbox
                          id={`location-user-${user.id}`}
                          onCheckedChange={(checked) =>
                            handleSelectLocationUser(
                              user.id,
                              checked as boolean
                            )
                          }
                          checked={selectedLocationUsers.includes(user.id)}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                      <TableCell>{user.name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <Button
            variant="outline"
            size="sm"
            className="w-28 gap-2"
            onClick={handleMoveToAvailable}
            disabled={selectedLocationUsers.length === 0 || isReadOnly}
          >
            <ArrowRightIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-28 gap-2"
            onClick={handleMoveToLocation}
            disabled={selectedAvailableUsers.length === 0 || isReadOnly}
          >
            <ArrowLeftIcon />
          </Button>
        </div>

        <div className="flex-1 flex flex-col min-w-[400px]">
          <CardHeader className="px-0 pt-0">
            <h1 className="text-xl font-semibold">Available Users</h1>
            <p className="text-sm text-muted-foreground">
              Users that can be added to this location
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        id="select-available-all"
                        onCheckedChange={(checked) =>
                          handleSelectAllAvailableUsers(checked as boolean)
                        }
                        disabled={isReadOnly}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-[50px]">
                        <Checkbox
                          id={`available-user-${user.id}`}
                          onCheckedChange={(checked) =>
                            handleSelectAvailableUser(
                              user.id,
                              checked as boolean
                            )
                          }
                          checked={selectedAvailableUsers.includes(user.id)}
                          disabled={isReadOnly}
                        />
                      </TableCell>
                      <TableCell>{user.name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
