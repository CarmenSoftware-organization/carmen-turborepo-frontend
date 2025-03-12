import { z } from 'zod';

//#region  Zod Create
export const BusinessUnitCreateSchema = z
  .object({
    cluster_id: z
      .string({
        required_error: 'cluster_id field is required',
      })
      .min(1, 'cluster_id must be at least 1 characters'),
    code: z
      .string({
        required_error: 'code field is required',
      })
      .min(3, 'code must be at least 3 characters'),
    name: z
      .string({
        required_error: 'name field is required',
      })
      .min(3, 'name must be at least 3 characters'),
    is_hq: z.boolean({
      required_error: 'is_hq field is required',
    }),
    is_active: z.boolean({
      required_error: 'is_active field is required',
    }),
  })
  .required();

export type BusinessUnitCreateModel = z.infer<typeof BusinessUnitCreateSchema>;

export class BusinessUnitCreateDto implements BusinessUnitCreateModel {
  cluster_id!: string;
  code!: string;
  name!: string;
  is_hq!: boolean;
  is_active!: boolean;
}

//#endregion Zod Create

//#region  Zod Update

export const BusinessUnitUpdateSchema = z.object({
  id: z.string().optional(),
  cluster_id: z
    .string({
      required_error: 'cluster_id field is required',
    })
    .min(1, 'cluster_id must be at least 1 characters')
    .optional(),
  code: z
    .string({
      required_error: 'code field is required',
    })
    .min(3, 'code must be at least 3 characters')
    .optional(),
  name: z
    .string({
      required_error: 'name field is required',
    })
    .min(3, 'name must be at least 3 characters')
    .optional(),
  is_hq: z
    .boolean({
      required_error: 'is_hq field is required',
    })
    .optional(),
  is_active: z
    .boolean({
      required_error: 'is_active field is required',
    })
    .optional(),
});

export type BusinessUnitUpdateModel = z.infer<typeof BusinessUnitUpdateSchema>;

export class BusinessUnitUpdateDto implements BusinessUnitUpdateModel {
  id?: string;
  cluster_id?: string;
  code?: string;
  name?: string;
  is_hq?: boolean;
  is_active?: boolean;
}

//#endregion Zod Update

export type BusinessUnitDto = {
	id: string;
	cluster_id: string;
	unit_code: string;
	unit_name: string;
	is_hq: boolean;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
};

export const mockBusinessUnits = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    cluster_id: '550e8400-e29b-41d4-a716-446655440000',
    code: 'BKK01',
    name: 'สำนักงานใหญ่กรุงเทพ',
    is_hq: true,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    cluster_id: '550e8400-e29b-41d4-a716-446655440001',
    code: 'CNX01',
    name: 'สาขาเชียงใหม่',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    cluster_id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'KKN01',
    name: 'สาขาขอนแก่น',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    cluster_id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'UDN01',
    name: 'สาขาอุดรธานี',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    cluster_id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'HYI01',
    name: 'สาขาหาดใหญ่',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    cluster_id: '550e8400-e29b-41d4-a716-446655440002',
    code: 'PKT01',
    name: 'สาขาภูเก็ต',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    cluster_id: '550e8400-e29b-41d4-a716-446655440003',
    code: 'RYG01',
    name: 'สาขาระยอง',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    cluster_id: '550e8400-e29b-41d4-a716-446655440003',
    code: 'CRI01',
    name: 'สาขาชลบุรี',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    cluster_id: '550e8400-e29b-41d4-a716-446655440001',
    code: 'NMA01',
    name: 'สาขานครราชสีมา',
    is_hq: false,
    is_active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    cluster_id: '550e8400-e29b-41d4-a716-446655440001',
    code: 'BRM01',
    name: 'สาขาบุรีรัมย์',
    is_hq: false,
    is_active: true,
  },
];
