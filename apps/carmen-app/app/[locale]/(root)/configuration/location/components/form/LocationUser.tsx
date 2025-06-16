import { Checkbox } from "@/components/ui/checkbox";
import { formType } from "@/dtos/form.dto";
import { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { FormLocationValues } from "./LocationForm";

interface UserBasicInfo {
  id: string;
  name: string;
}

interface LocationUserProps {
  readonly initCurrentUsers: UserBasicInfo[];
  readonly initAvailableUsers: UserBasicInfo[];
  readonly formType: formType;
  readonly formControl: Control<FormLocationValues>;
}

export default function LocationUser({
  initCurrentUsers,
  initAvailableUsers,
  formType,
  formControl,
}: LocationUserProps) {
  const { field } = useController({
    name: "users",
    control: formControl,
  });

  const [currentUsers, setCurrentUsers] = useState<UserBasicInfo[]>(
    initCurrentUsers || []
  );
  const [availableUsers, setAvailableUsers] = useState<UserBasicInfo[]>(
    initAvailableUsers || []
  );

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

  const isReadOnly = formType === "view";

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
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Location Users</h1>
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-location-users-all"
            onCheckedChange={(checked) =>
              handleSelectAllLocationUsers(checked as boolean)
            }
            checked={selectedLocationUsers.length === currentUsers.length}
            disabled={isReadOnly}
          />
          <label
            htmlFor="select-location-users-all"
            className="text-xl font-medium"
          >
            Select All
          </label>
        </div>
        <div className="flex flex-col gap-4">
          {currentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Checkbox
                id={`location-user-${user.id}`}
                onCheckedChange={(checked) =>
                  handleSelectLocationUser(user.id, checked as boolean)
                }
                checked={selectedLocationUsers.includes(user.id)}
                disabled={isReadOnly}
              />
              <label htmlFor={`location-user-${user.id}`}>
                {user.name || "-"}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="bg-red-100 p-2 disabled:opacity-50"
          onClick={handleMoveToAvailable}
          disabled={selectedLocationUsers.length === 0 || isReadOnly}
        >
          Remove
        </button>
        <button
          className="bg-green-100 p-2 disabled:opacity-50"
          onClick={handleMoveToLocation}
          disabled={selectedAvailableUsers.length === 0 || isReadOnly}
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Available Users</h1>
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-available-all"
            onCheckedChange={(checked) =>
              handleSelectAllAvailableUsers(checked as boolean)
            }
            disabled={isReadOnly}
          />
          <label htmlFor="select-available-all" className="text-xl font-medium">
            Select All
          </label>
        </div>
        <div className="flex flex-col gap-4">
          {availableUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Checkbox
                id={`available-user-${user.id}`}
                onCheckedChange={(checked) =>
                  handleSelectAvailableUser(user.id, checked as boolean)
                }
                checked={selectedAvailableUsers.includes(user.id)}
                disabled={isReadOnly}
              />
              <label htmlFor={`available-user-${user.id}`}>
                {user.name || "-"}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
