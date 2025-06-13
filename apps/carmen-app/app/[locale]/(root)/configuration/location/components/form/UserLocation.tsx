"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FormValues } from "./LocationForm";

// UI Components
const UserListColumn = ({
  title,
  users,
  checkedItems,
  onCheckChange,
}: {
  title: string;
  users: { id: string }[];
  checkedItems: { [key: string]: boolean };
  onCheckChange: (id: string, checked: boolean) => void;
}) => (
  <div className="border rounded-md p-4">
    <h3 className="font-medium mb-2">{title}</h3>
    <div className="space-y-2">
      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${title.replace(/\s+/g, "-")}-${user.id}`}
                checked={checkedItems[user.id] || false}
                onCheckedChange={(checked) =>
                  onCheckChange(user.id, checked as boolean)
                }
              />
              <span className="text-sm">{user.id}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">ไม่มีผู้ใช้งาน</p>
      )}
    </div>
  </div>
);

const TransferButtons = ({
  onMoveLeft,
  onMoveRight,
}: {
  onMoveLeft: () => void;
  onMoveRight: () => void;
}) => (
  <div className="flex flex-col gap-2 justify-center h-full pt-8">
    <Button variant="outline" size="icon" type="button" onClick={onMoveLeft}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="icon" type="button" onClick={onMoveRight}>
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
);

interface UserLocationProps {
  control: Control<FormValues>;
  initialUsers?: { id: string }[];
  userList: { id: string }[];
}

export default function UserLocation({
  control,
  initialUsers = [],
  userList,
}: UserLocationProps) {
  const [leftCheckedItems, setLeftCheckedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [rightCheckedItems, setRightCheckedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const {
    fields: addFields,
    append: appendAdd,
    remove: removeAdd,
  } = useFieldArray({
    control,
    name: "users.add",
  });

  const { fields: removeFields, append: appendRemove } = useFieldArray({
    control,
    name: "users.remove",
  });

  // Helper function to get current users list
  const getCurrentUsers = () => {
    const currentUsers = [...initialUsers];

    // Remove users in remove list
    removeFields.forEach((user) => {
      const index = currentUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        currentUsers.splice(index, 1);
      }
    });

    // Add users in add list
    addFields.forEach((user) => {
      if (!currentUsers.some((u) => u.id === user.id)) {
        currentUsers.push(user);
      }
    });

    return currentUsers;
  };

  // Helper function to get available users list
  const getAvailableUsers = () => {
    const currentUsers = getCurrentUsers();
    return userList.filter(
      (user) => !currentUsers.some((u) => u.id === user.id)
    );
  };

  // State Management Functions
  const handleMoveToLeft = () => {
    const selectedUsers = getAvailableUsers().filter(
      (user) => rightCheckedItems[user.id]
    );

    if (selectedUsers.length > 0) {
      selectedUsers.forEach((user) => {
        appendAdd({ id: user.id });
      });

      setRightCheckedItems({});
    }
  };

  const handleMoveToRight = () => {
    const selectedUsers = getCurrentUsers().filter(
      (user) => leftCheckedItems[user.id]
    );

    if (selectedUsers.length > 0) {
      selectedUsers.forEach((user) => {
        const addIndex = addFields.findIndex((field) => field.id === user.id);
        if (addIndex !== -1) {
          removeAdd(addIndex);
        } else {
          appendRemove({ id: user.id });
        }
      });

      setLeftCheckedItems({});
    }
  };

  const handleCheckChange = (
    userId: string,
    checked: boolean,
    side: "left" | "right"
  ) => {
    if (side === "left") {
      setLeftCheckedItems((prev) => ({ ...prev, [userId]: checked }));
    } else {
      setRightCheckedItems((prev) => ({ ...prev, [userId]: checked }));
    }
  };

  const currentUsers = getCurrentUsers();
  const availableUsers = getAvailableUsers();

  return (
    <div className="flex gap-4">
      <UserListColumn
        title="ผู้ใช้งานที่มีสิทธิ์"
        users={currentUsers.map((user) => {
          const userInfo = userList.find((u) => u.id === user.id);
          return userInfo || user;
        })}
        checkedItems={leftCheckedItems}
        onCheckChange={(userId, checked) =>
          handleCheckChange(userId, checked, "left")
        }
      />
      <TransferButtons
        onMoveLeft={handleMoveToLeft}
        onMoveRight={handleMoveToRight}
      />
      <UserListColumn
        title="ผู้ใช้งานที่สามารถเพิ่มได้"
        users={availableUsers.map((user) => {
          const userInfo = userList.find((u) => u.id === user.id);
          return userInfo || user;
        })}
        checkedItems={rightCheckedItems}
        onCheckChange={(userId, checked) =>
          handleCheckChange(userId, checked, "right")
        }
      />
    </div>
  );
}
