"use client";

import { Transfer } from "@/components/ui-custom/Transfer";
import { useState } from "react";

const availableMockUsers = [
  {
    key: "id-001",
    title: "John Doe",
  },
  {
    key: "id-002",
    title: "Jane Smith",
  },
  {
    key: "id-003",
    title: "Jim Beam",
  },
  {
    key: "id-004",
    title: "Jill Johnson",
  },
  {
    key: "id-005",
    title: "Jack Daniels",
  },
  {
    key: "id-006",
    title: "Joe Johnson",
  },
];

const initUsers = [
  {
    key: "id-007",
    title: "Alice Cooper",
  },
  {
    key: "id-008",
    title: "Bob Martin",
  },
  {
    key: "id-009",
    title: "Charlie Brown",
  },
  {
    key: "id-010",
    title: "Diana Prince",
  },
];

export default function TransferPage() {
  const [targetKeys, setTargetKeys] = useState<string[]>(
    initUsers.map((user) => user.key)
  );

  return (
   <div className="w-full space-y-4">
    <h1>Transfer Component</h1>
     <Transfer
      dataSource={availableMockUsers}
      leftDataSource={initUsers}
      targetKeys={targetKeys}
      onChange={(targetKeys: (string | number)[]) =>
        setTargetKeys(targetKeys as string[])
      }
      titles={["Init Users", "Available Users"]}
      operations={["<", ">"]}
    />
   </div>
  );
}
