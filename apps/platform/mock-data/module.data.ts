import { ModuleDto } from "@/dto/module.dto";

export const mockModules: ModuleDto[] = [
    {
        id: "erp-finance",
        name: "Financial Management",
        description: "Comprehensive financial management solution including general ledger, accounts payable/receivable, and financial reporting capabilities.",
        available_plans: [
            {
                id: "basic-fin",
                name: "Basic"
            },
            {
                id: "pro-fin",
                name: "Professional"
            },
        ],
        status: true,
        created_at: "2023-01-15T08:30:00Z",
        updated_at: "2023-06-22T14:45:00Z"
    },
    {
        id: "erp-inventory",
        name: "Inventory Management",
        description: "Complete inventory control system with real-time tracking, automated reordering, and warehouse management.",
        available_plans: [
            {
                id: "basic-inv",
                name: "Basic"
            },
            {
                id: "pro-inv",
                name: "Professional"
            },
            {
                id: "ent-inv",
                name: "Enterprise"
            }
        ],
        status: true,
        created_at: "2023-02-10T09:15:00Z",
        updated_at: "2023-07-05T11:20:00Z"
    },
    {
        id: "erp-hr",
        name: "Human Resources",
        description: "HR management tools including employee records, payroll processing, benefits administration, and performance management.",
        available_plans: [
            {
                id: "basic-hr",
                name: "Basic"
            },
            {
                id: "pro-hr",
                name: "Professional"
            },
            {
                id: "ent-hr",
                name: "Enterprise"
            }
        ],
        status: true,
        created_at: "2023-03-05T10:45:00Z",
        updated_at: "2023-08-12T15:30:00Z"
    },
    {
        id: "erp-crm",
        name: "Customer Relationship Management",
        description: "Tools for managing customer interactions, sales pipelines, marketing campaigns, and customer service.",
        available_plans: [
            {
                id: "basic-crm",
                name: "Basic"
            },
        ],
        status: true,
        created_at: "2023-04-18T13:20:00Z",
        updated_at: "2023-09-01T09:10:00Z"
    },
    {
        id: "erp-production",
        name: "Production Planning",
        description: "Manufacturing and production management with scheduling, resource allocation, and quality control features.",
        available_plans: [
            {
                id: "pro-prod",
                name: "Professional"
            },
            {
                id: "ent-prod",
                name: "Enterprise"
            }
        ],
        status: true,
        created_at: "2023-05-22T11:00:00Z",
        updated_at: "2023-10-15T16:45:00Z"
    }
]