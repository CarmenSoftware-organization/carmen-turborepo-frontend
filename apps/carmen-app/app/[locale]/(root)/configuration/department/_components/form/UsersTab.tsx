"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Transfer } from "@/components/ui-custom/Transfer";
import { Switch } from "@/components/ui/switch";
import { DepartmentFormData } from "../../_schemas/department-form.schema";
import { useCallback } from "react";

interface UserItemProps {
  item: {
    key: string | number;
    title: string;
  };
  hodStates: Record<string, boolean>;
  onHodChange: (key: string, checked: boolean) => void;
  isViewMode: boolean;
}

const UserItem = ({ item, hodStates, onHodChange, isViewMode }: UserItemProps) => (
  <div className="fxb-c w-full gap-4">
    <span>{item.title}</span>
    <div className="fxr-c gap-2">
      <span className="text-muted-foreground">HOD</span>
      <Switch
        checked={hodStates[item.key.toString()] || false}
        onCheckedChange={(checked) => onHodChange(item.key.toString(), checked)}
        disabled={isViewMode}
      />
    </div>
  </div>
);

interface UsersTabProps {
  readonly form: UseFormReturn<DepartmentFormData>;
  readonly isViewMode: boolean;
  readonly availableUsers: { key: string | number; title: string }[];
  readonly initUsers: Array<{ key: string; title: string; id: string; isHod: boolean }>;
  readonly targetKeys: string[];
  readonly setTargetKeys: (keys: string[]) => void;
  readonly hodStates: Record<string, boolean>;
  readonly setHodStates: (
    states: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
}

export default function UsersTab({
  form,
  isViewMode,
  availableUsers,
  initUsers,
  targetKeys,
  setTargetKeys,
  hodStates,
  setHodStates,
}: UsersTabProps) {
  const tDepartment = useTranslations("Department");

  const handleMoveToRight = useCallback(
    (moveKeys: (string | number)[], currentUsers: { add: any[]; update: any[]; remove: any[] }) => {
      const newAddArray = [...(currentUsers.add || [])];
      const newRemoveArray = [...(currentUsers.remove || [])];

      for (const key of moveKeys) {
        const keyStr = key.toString();
        const existingRemoveIndex = newRemoveArray.findIndex((item) => item.id === keyStr);

        if (existingRemoveIndex >= 0) {
          newRemoveArray.splice(existingRemoveIndex, 1);
        } else {
          newAddArray.push({
            id: keyStr,
            isHod: hodStates[keyStr] || false,
          });
        }

        if (!hodStates.hasOwnProperty(keyStr)) {
          setHodStates((prev) => ({ ...prev, [keyStr]: false }));
        }
      }

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
    },
    [hodStates, form, setHodStates]
  );

  const handleMoveToLeft = useCallback(
    (moveKeys: (string | number)[], currentUsers: { add: any[]; update: any[]; remove: any[] }) => {
      const newAddArray = [...(currentUsers.add || [])];
      const newRemoveArray = [...(currentUsers.remove || [])];

      for (const key of moveKeys) {
        const keyStr = key.toString();
        const existingAddIndex = newAddArray.findIndex((item) => item.id === keyStr);

        if (existingAddIndex >= 0) {
          newAddArray.splice(existingAddIndex, 1);
        } else {
          newRemoveArray.push({ id: keyStr });
        }

        setHodStates((prev) => {
          const newState = { ...prev };
          delete newState[keyStr];
          return newState;
        });
      }

      const currentUpdateArray = currentUsers.update || [];
      const updatedUpdateArray = currentUpdateArray.filter(
        (user: { id: string; isHod: boolean }) =>
          !moveKeys.some((key) => key.toString() === user.id)
      );

      form.setValue("users.add", newAddArray);
      form.setValue("users.remove", newRemoveArray);
      form.setValue("users.update", updatedUpdateArray);
    },
    [form, setHodStates]
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
        const currentUpdateArray = currentUsers.update;
        const existingUpdateIndex = currentUpdateArray.findIndex((user) => user.id === key);
        const originalUser = initUsers.find((user) => user.key.toString() === key);
        const originalIsHod = originalUser?.isHod || false;
        let updatedUpdateArray;
        if (checked === originalIsHod) {
          updatedUpdateArray = currentUpdateArray.filter((user) => user.id !== key);
        } else if (existingUpdateIndex >= 0) {
          updatedUpdateArray = currentUpdateArray.map((user, index) =>
            index === existingUpdateIndex ? { ...user, isHod: checked } : user
          );
        } else {
          updatedUpdateArray = [...currentUpdateArray, { id: key, isHod: checked }];
        }
        form.setValue("users.update", updatedUpdateArray);
      } else if (isNewUser) {
        const currentAddArray = currentUsers.add;
        const updatedAddArray = currentAddArray.map((user) =>
          user.id === key ? { ...user, isHod: checked } : user
        );
        form.setValue("users.add", updatedAddArray);
      }
    },
    [form, initUsers, isViewMode, setHodStates]
  );

  const renderUserItem = useCallback(
    (item: { key: string | number; title: string }) => (
      <UserItem
        item={item}
        hodStates={hodStates}
        onHodChange={handleHodChange}
        isViewMode={isViewMode}
      />
    ),
    [hodStates, handleHodChange, isViewMode]
  );

  const selectedUsers = targetKeys
    .map((key) => {
      const user = availableUsers?.find(
        (u: { key: string | number; title: string }) => u.key.toString() === key
      );
      return {
        key: key,
        title: user?.title || "",
        isHod: hodStates[key] || false,
      };
    })
    .filter((user) => user.title !== "");

  if (isViewMode) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {tDepartment("users")} ({selectedUsers.length})
        </h2>

        {selectedUsers.length > 0 ? (
          <div className="grid gap-3">
            {selectedUsers.map((user) => (
              <div
                key={user.key}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border"
              >
                <span className="text-sm font-medium">{user.title}</span>
                {user.isHod && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md font-medium">
                    HOD
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
            <p className="text-sm text-muted-foreground">{tDepartment("no_users_assigned")}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {tDepartment("users")}
      </h2>

      <Transfer
        dataSource={availableUsers}
        leftDataSource={initUsers}
        targetKeys={targetKeys}
        onChange={handleTransferChange}
        titles={[tDepartment("available_users"), tDepartment("selected_users")]}
        operations={["<", ">"]}
        leftRender={renderUserItem}
      />
    </div>
  );
}
