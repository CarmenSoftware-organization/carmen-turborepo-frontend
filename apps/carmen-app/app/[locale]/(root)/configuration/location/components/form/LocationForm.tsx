import { Checkbox } from "@/components/ui/checkbox";
import { LocationByIdDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { useUserList } from "@/hooks/useUserList";
import { useState } from "react";
import LocationUser from "./LocationUser";

interface LocationFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly initialData?: any;
  readonly mode: formType;
}

type UserDto = {
  id: string;
  name?: string;
};

const locationUsers: UserDto[] = [
  {
    id: "id-001",
    name: "",
  },
  {
    id: "id-002",
    name: "Jane Doe",
  },
];

const userLists: UserDto[] = [
  {
    id: "id-003",
    name: "Daew",
  },
  {
    id: "id-004",
    name: "Pong",
  },
  {
    id: "id-005",
    name: "Oat",
  },
];

export default function LocationForm({ initialData, mode }: LocationFormProps) {
  
  const { userList } = useUserList();


  return (
   <>
  
    <LocationUser
      initCurrentUsers={initialData?.users || []}
      initAvailableUsers={userList || []}
      formType={mode}
    />
   </>
  );
}
