"use client";

import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const columns: TableColumn[] = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no",
        width: "w-12",
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
            <Badge variant="outline">{status}</Badge>
        ),
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_: any, record: any) => (
            <Button onClick={() => console.log('Edit:', record)}>
                Edit
            </Button>
        ),
    },
];

const dataSource: TableDataSource[] = [
    {
        key: "1",
        no: 1,
        name: "John Doe",
        status: "Active",
    },
    {
        key: "2",
        no: 2,
        name: "Jane Smith",
        status: "Inactive",
    }
];

export default function TablePage() {
    return (
        <TableTemplate
            columns={columns}
            dataSource={dataSource}
            emptyMessage="ไม่มีข้อมูล"
        />
    )
}