import { UserForm } from "./UserForm";
import { LocationForm } from "./LocationForm";
import { Card } from "@/components/ui/card";

export default function FormReusePage() {
  return (
    <div className="p-6 space-y-4 mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <UserForm />
        </Card>
        <Card className="p-4">
          <LocationForm />
        </Card>
      </div>
    </div>
  );
}
