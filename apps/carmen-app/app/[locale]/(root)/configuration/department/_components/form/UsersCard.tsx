"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Transfer } from "@/components/ui-custom/Transfer";
import { DepartmentFormData } from "../../_schemas/department-form.schema";
import { useCallback, useMemo } from "react";
import { UserDpDto } from "../../_types/users-department.type";
import UsersDepartment from "./UsersDepartment";
import UserItem from "./UserItem";
import { TransferItem } from "@/dtos/transfer.dto";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowLeftRight } from "lucide-react";

interface UserAddUpdateOperation {
  id: string;
  is_hod: boolean;
}

interface UserRemoveOperation {
  id: string;
}

interface CurrentUsersState {
  add: UserAddUpdateOperation[];
  update: UserAddUpdateOperation[];
  remove: UserRemoveOperation[];
}

interface Props {
  readonly form: UseFormReturn<DepartmentFormData>;
  readonly isViewMode: boolean;
  readonly availableUsers: UserDpDto[];
  readonly initUsers: UserDpDto[];
  readonly targetKeys: string[];
  readonly setTargetKeys: (keys: string[]) => void;
  readonly hodStates: Record<string, boolean>;
  readonly setHodStates: (
    states: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
}

export default function UsersCard({
  form,
  isViewMode,
  availableUsers,
  initUsers,
  targetKeys,
  setTargetKeys,
  hodStates,
  setHodStates,
}: Props) {
  const tDepartment = useTranslations("Department");

  const handleMoveToRight = useCallback(
    (moveKeys: (string | number)[], currentUsers: CurrentUsersState) => {
      const newAddArray = [...(currentUsers.add || [])];
      const newRemoveArray = [...(currentUsers.remove || [])];

      for (const key of moveKeys) {
        const keyStr = key.toString();
        const existingRemoveIndex = newRemoveArray.findIndex((item) => item.id === keyStr);
        const isExistingUser = initUsers.some((user) => user.key.toString() === keyStr);

        if (existingRemoveIndex >= 0) {
          // User was marked for removal, remove from remove array
          newRemoveArray.splice(existingRemoveIndex, 1);
        } else if (!isExistingUser) {
          // Only add to add array if it's a new user (not in initUsers)
          // Check if not already in add array to prevent duplicates
          const alreadyInAddArray = newAddArray.some((user) => user.id === keyStr);
          if (!alreadyInAddArray) {
            newAddArray.push({
              id: keyStr,
              is_hod: hodStates[keyStr] || false,
            });
          }
        }

        if (!hodStates.hasOwnProperty(keyStr)) {
          setHodStates((prev) => ({ ...prev, [keyStr]: false }));
        }
      }

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
    },
    [hodStates, form, setHodStates, initUsers]
  );

  const handleMoveToLeft = useCallback(
    (moveKeys: (string | number)[], currentUsers: CurrentUsersState) => {
      const newAddArray = [...(currentUsers.add || [])];
      const newRemoveArray = [...(currentUsers.remove || [])];

      for (const key of moveKeys) {
        const keyStr = key.toString();
        const existingAddIndex = newAddArray.findIndex((item) => item.id === keyStr);
        const isExistingUser = initUsers.some((user) => user.key.toString() === keyStr);

        if (existingAddIndex >= 0) {
          newAddArray.splice(existingAddIndex, 1);
        } else if (isExistingUser) {
          const alreadyInRemoveArray = newRemoveArray.some((user) => user.id === keyStr);
          if (!alreadyInRemoveArray) {
            newRemoveArray.push({ id: keyStr });
          }
        }

        setHodStates((prev) => {
          const newState = { ...prev };
          delete newState[keyStr];
          return newState;
        });
      }

      const currentUpdateArray = currentUsers.update || [];
      const updatedUpdateArray = currentUpdateArray.filter(
        (user: { id: string; is_hod: boolean }) =>
          !moveKeys.some((key) => key.toString() === user.id)
      );

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
      form.setValue("users.update", updatedUpdateArray);
    },
    [form, setHodStates, initUsers]
  );

  const handleTransferChange = (
    newTargetKeys: (string | number)[],
    direction: "left" | "right",
    moveKeys: (string | number)[]
  ) => {
    if (isViewMode) return;

    setTargetKeys(newTargetKeys as string[]);

    const users = form.getValues("users");
    const currentUsers = {
      add: users?.add || [],
      update: users?.update || [],
      remove: users?.remove || [],
    };

    if (direction === "right") {
      handleMoveToRight(moveKeys, currentUsers);
    } else if (direction === "left") {
      handleMoveToLeft(moveKeys, currentUsers);
    }
  };

  const handleHodChange = useCallback(
    (key: string, checked: boolean) => {
      if (isViewMode) return;

      setHodStates((prev) => ({
        ...prev,
        [key]: checked,
      }));

      const users = form.getValues("users");
      const currentUsers = {
        add: users?.add || [],
        update: users?.update || [],
        remove: users?.remove || [],
      };

      const isExistingUser = initUsers.some((user) => user.key.toString() === key);
      const isNewUser = currentUsers.add.some((user) => user.id === key);

      if (isExistingUser && !isNewUser) {
        // Handle existing user HOD change
        const currentUpdateArray = currentUsers.update;
        const existingUpdateIndex = currentUpdateArray.findIndex((user) => user.id === key);
        const originalUser = initUsers.find((user) => user.key.toString() === key);
        const originalIsHod = originalUser?.is_hod || false;

        let updatedUpdateArray;
        if (checked === originalIsHod) {
          // HOD value same as original, remove from update array
          updatedUpdateArray = currentUpdateArray.filter((user) => user.id !== key);
        } else if (existingUpdateIndex >= 0) {
          // Update existing entry in update array
          updatedUpdateArray = currentUpdateArray.map((user, index) =>
            index === existingUpdateIndex ? { ...user, is_hod: checked } : user
          );
        } else {
          // Add new entry to update array (no duplicate check needed due to findIndex above)
          updatedUpdateArray = [...currentUpdateArray, { id: key, is_hod: checked }];
        }
        form.setValue("users.update", updatedUpdateArray);
      } else if (isNewUser) {
        // Handle new user HOD change - update in add array
        const currentAddArray = currentUsers.add;
        const updatedAddArray = currentAddArray.map((user) =>
          user.id === key ? { ...user, is_hod: checked } : user
        );
        form.setValue("users.add", updatedAddArray);
      }
    },
    [form, initUsers, isViewMode, setHodStates]
  );

  const renderUserItem = useCallback(
    (item: TransferItem) => (
      <UserItem
        item={item}
        hodStates={hodStates}
        onHodChange={handleHodChange}
        isViewMode={isViewMode}
      />
    ),
    [hodStates, handleHodChange, isViewMode]
  );

  const pendingChanges = useMemo(() => {
    const users = form.getValues("users");
    return {
      add: users?.add?.length || 0,
      update: users?.update?.length || 0,
      remove: users?.remove?.length || 0,
    };
  }, [form, targetKeys, hodStates]);

  const hasChanges =
    pendingChanges.add > 0 || pendingChanges.update > 0 || pendingChanges.remove > 0;

  if (isViewMode) {
    return <UsersDepartment initUsers={initUsers} />;
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <Alert className="bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/10 dark:border-blue-800/30">
        <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
          {tDepartment("transfer_instructions")}
        </AlertDescription>
      </Alert>

      {/* Transfer Component */}
      <div className="relative">
        <Transfer
          dataSource={availableUsers}
          leftDataSource={initUsers}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          titles={[
            <span key="selected" className="flex items-center gap-1.5">
              {tDepartment("selected_users")}
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {targetKeys.length}
              </span>
            </span>,
            <span key="available" className="flex items-center gap-1.5">
              {tDepartment("available_users")}
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                {availableUsers.length}
              </span>
            </span>,
          ]}
          operations={["<", ">"]}
          leftRender={renderUserItem}
          showSearch
        />
      </div>

      {/* Pending Changes Summary */}
      {hasChanges && (
        <div
          className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 dark:bg-amber-950/10 dark:border-amber-800/30"
          role="status"
          aria-live="polite"
        >
          <ArrowLeftRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-amber-700 dark:text-amber-300">
            {pendingChanges.add > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
                {tDepartment("pending_add")}: {pendingChanges.add}
              </span>
            )}
            {pendingChanges.update > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                {tDepartment("pending_update")}: {pendingChanges.update}
              </span>
            )}
            {pendingChanges.remove > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                {tDepartment("pending_remove")}: {pendingChanges.remove}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
