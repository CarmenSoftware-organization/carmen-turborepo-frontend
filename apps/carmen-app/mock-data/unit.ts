import { UnitDto } from "@/dtos/unit.dto";

export const mockUnits: UnitDto[] = [
    { id: "1", name: "Kilogram", code: "KG", status: true },
    { id: "2", name: "Gram", code: "G", status: true },
    { id: "3", name: "Meter", code: "M", status: false },
    { id: "4", name: "Centimeter", code: "CM", status: false },
    { id: "5", name: "Millimeter", code: "MM", status: false },
    { id: "6", name: "Liter", code: "L", status: true },
    { id: "7", name: "Milliliter", code: "ML", status: true },
    { id: "8", name: "Piece", code: "PCS", status: false },
    { id: "9", name: "Dozen", code: "DZ", status: false },
    { id: "10", name: "Pack", code: "PK", status: false },
];

