"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cat404,
  Cat500,
  Cat401,
  Cat403,
  Cat503,
  Cat408,
} from "@/components/error-ui/illustrations";

const errorComponents = [
  {
    code: "404",
    title: "Page Not Found",
    Component: Cat404,
  },
  {
    code: "500",
    title: "Internal Server Error",
    Component: Cat500,
  },
  {
    code: "401",
    title: "Unauthorized",
    Component: Cat401,
  },
  { code: "403", title: "Forbidden", description: "แมวตกใจเห็นป้ายห้ามเข้า", Component: Cat403 },
  {
    code: "503",
    title: "Service Unavailable",
    Component: Cat503,
  },
  {
    code: "408",
    title: "Session Expired",
    Component: Cat408,
  },
];

export default function ErrorUIPlayground() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Error UI Components</h1>
        <p className="text-muted-foreground">ตัวอย่าง Error UI ทั้งหมด</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {errorComponents.map((error) => (
          <Card key={error.code} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-4xl font-bold text-primary/20">{error.code}</span>
                <span className="text-sm font-normal text-muted-foreground">{error.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="flex items-center justify-center py-4">
                <error.Component />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
