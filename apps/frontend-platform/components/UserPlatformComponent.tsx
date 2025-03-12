'use client';

import { useUserPlatform } from "@/hooks/useUserPlatform";
import { useState } from "react";
import DialogPlatform from "@/app/(main)/admin/users/components/platform/DialogPlatform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, SearchIcon, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { UserPlatformType } from "@/types/form/form";

interface UserPlatformComponentProps {
    initialData?: UserPlatformType[];
}

const UserPlatformComponent = ({ initialData = [] }: UserPlatformComponentProps) => {
    const { users, setUsers } = useUserPlatform({ initialData });
    const [searchTerm, setSearchTerm] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // กรองข้อมูลผู้ใช้ตามคำค้นหา
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ฟังก์ชันจัดการการค้นหา
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // ฟังก์ชันลบผู้ใช้
    const handleDeleteUser = (userId: string) => {
        if (confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?')) {
            setUsers(users.filter(user => user.id !== userId));
            // ในการใช้งานจริงควรมีการเรียก API เพื่อลบข้อมูลจากฐานข้อมูล
            // await deleteUserPlatform(userId);
        }
    };

    // ฟังก์ชันเปิด/ปิดเมนู
    const toggleMenu = (userId: string) => {
        setOpenMenuId(openMenuId === userId ? null : userId);
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">รายชื่อผู้ใช้แพลตฟอร์ม</CardTitle>
                <DialogPlatform setUserPlatform={setUsers} userPlatform={users} />
            </CardHeader>

            <CardContent>
                {/* ช่องค้นหาและฟิลเตอร์ */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="ค้นหาชื่อ หรืออีเมล์..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-shrink-0">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            กรองตามวันที่
                        </Button>
                        <Button variant="outline" className="flex-shrink-0">
                            สถานะ
                        </Button>
                    </div>
                </div>

                {/* แสดงจำนวนผู้ใช้ที่กรองได้ */}
                <div className="text-sm text-gray-500 mb-4">
                    แสดง <span className="font-medium">{filteredUsers.length}</span> จาก <span className="font-medium">{users.length}</span> รายการ
                </div>

                {/* แสดงข้อมูลเมื่อมี users */}
                {filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow bg-white relative"
                            >
                                {/* เมนูการจัดการ */}
                                <div className="absolute top-2 right-2">
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 p-0"
                                            onClick={() => toggleMenu(user.id)}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>

                                        {openMenuId === user.id && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                                                <button
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>แก้ไข</span>
                                                </button>
                                                <button
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>ลบ</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h2 className="font-semibold text-lg">{user.name}</h2>
                                <p className="text-gray-600 text-sm mb-2">{user.email}</p>

                                {user.roles && user.roles.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {user.roles.map((role: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {user.business_units && user.business_units.length > 0 && (
                                    <p className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium">หน่วยธุรกิจ:</span> {user.business_units.join(', ')}
                                    </p>
                                )}

                                <div className="flex justify-between items-center mt-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${user.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {user.status === 'active' ? 'กำลังใช้งาน' : 'ไม่ได้ใช้งาน'}
                                    </span>

                                    {user.lastActive && (
                                        <span className="text-xs text-gray-500">
                                            ใช้งานล่าสุด: {format(new Date(user.lastActive), 'dd/MM/yyyy')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                        <p className="text-gray-500 mb-2">
                            {searchTerm ? 'ไม่พบข้อมูลที่ตรงกับการค้นหา' : 'ไม่มีข้อมูลผู้ใช้'}
                        </p>
                        {searchTerm && (
                            <Button variant="outline" onClick={() => setSearchTerm("")}>
                                ล้างการค้นหา
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UserPlatformComponent; 