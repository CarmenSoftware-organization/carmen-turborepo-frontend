export type IUnitData = {
    id: string;
    name: string;
    is_decimal: boolean;
    is_active: boolean;
};

export const mockUnits: IUnitData[] = [
    { id: "9d4afa14-f565-4ae4-93d4-1d3cce6d0d84", name: "ชิ้น", is_decimal: false, is_active: true },
    { id: "930b1d01-f281-4ccf-a9fc-caade83c40a8", name: "กล่อง", is_decimal: false, is_active: true },
    { id: "a2b8330a-98ab-4181-9b82-eef55c75abd2", name: "แพ็ค", is_decimal: false, is_active: true },
    { id: "e1b054b5-f4a8-4ef2-8194-61c5e5b7462f", name: "โหล", is_decimal: false, is_active: true },
    { id: "f86154f9-ad2d-4b97-b1e1-3ffcf17628bd", name: "คู่", is_decimal: false, is_active: true },
    { id: "3a95228b-a951-4f41-8d3a-a9ea34316763", name: "กิโลกรัม", is_decimal: true, is_active: true },
    { id: "946864d7-798a-44ca-a181-d2cff2510929", name: "กรัม", is_decimal: true, is_active: true },
    { id: "793c68cd-8c7e-4273-9d84-34807b7b6869", name: "ลิตร", is_decimal: true, is_active: true },
    { id: "00ccbc37-ae99-4ad0-af4e-775728839dc2", name: "มิลลิลิตร", is_decimal: true, is_active: true },
    { id: "481cd0b9-923e-462d-97ec-6111f22e3352", name: "เมตร", is_decimal: true, is_active: true },
    { id: "0d206f83-0dbd-4783-9fe6-5d9deafbb62d", name: "เซนติเมตร", is_decimal: true, is_active: true },
    { id: "084f6db3-b472-4101-b637-c89e2b1d5a8d", name: "ชุด", is_decimal: false, is_active: true },
    { id: "73ede43c-dd3f-47e2-91dd-c921cdb06e7b", name: "ขวด", is_decimal: false, is_active: true },
    { id: "9f5b8d66-9915-4433-bae6-d4e45cf0e4cd", name: "กระป๋อง", is_decimal: false, is_active: true },
    { id: "9c40a09d-a53f-4b11-ab37-a713b62df675", name: "ถุง", is_decimal: false, is_active: true },
];