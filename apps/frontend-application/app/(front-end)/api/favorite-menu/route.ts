import { FavMenuItem } from "@/dtos/favorite-menu.dto";
import { NextResponse } from "next/server";
const favoriteMenu: FavMenuItem[] = [
    {
        title: 'My Approval',
        path: "/procurement/my-approvals",
        visible: true,
        enabled: true,
    },
    {
        title: 'Purchase Requests',
        path: "/procurement/purchase-requests",
        visible: true,
        enabled: true,
    },

];
export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            data: favoriteMenu,
        });
    } catch (error) {
        console.error('Error fetching cuisine types:', error);
        return NextResponse.json(
            {
                success: false,
                data: [],
                message: 'Failed to fetch recipes',
            },
            { status: 500 }
        );
    }
}