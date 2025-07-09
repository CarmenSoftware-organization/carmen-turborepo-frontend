import { TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";

export const taxProfileMock: TaxProfileGetAllDto[] = [
  {
    id: "2fcf1dca-10b2-4c3e-bf02-01630a4ac09e",
    name: "VAT 0%",
    tax_rate: 0,
    is_active: true,
  },
  {
    id: "242244e9-6fdf-43f9-b59a-34d03cbb3a7e",
    name: "VAT 7%",
    tax_rate: 7,
    is_active: true,
  },
  {
    id: "0719e062-c1f5-4a54-9ff0-5dd7ad160e4d",
    name: "VAT 10%",
    tax_rate: 10,
    is_active: true,
  },
];
