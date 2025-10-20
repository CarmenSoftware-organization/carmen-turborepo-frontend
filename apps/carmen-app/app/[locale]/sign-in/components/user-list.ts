import { PLATFORM_ROLE } from "@/constants/enum";

export const userList = [
    {
        email: "newuser2@example.com",
    },
    {
        email: "system-admin@blueledgers.com",
        firstname: "system-admin",
        lastname: "system-admin",
        platform_role: PLATFORM_ROLE.PLATFORM_ADMIN,
        created_by_id: null
    },
    {
        email: "test@test.com",
        firstname: "test",
        lastname: "test",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "admin@blueledgers.com",
        firstname: "admin",
        lastname: "admin",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "user1@blueledgers.com",
        firstname: "user1",
        lastname: "staff",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "user2@blueledgers.com",
        firstname: "user2",
        lastname: "department-manager",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "user3@blueledgers.com",
        firstname: "user3",
        lastname: "purchasing-staff",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "user4@blueledgers.com",
        firstname: "user4",
        lastname: "finance-manager",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },
    {
        email: "user5@blueledgers.com",
        firstname: "user5",
        lastname: "general-manager",
        platform_role: PLATFORM_ROLE.USER,
        created_by_id: "system_admin"
    },

]