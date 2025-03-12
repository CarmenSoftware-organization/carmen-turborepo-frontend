import { z } from 'zod';

export enum enum_location_type {
	inventory = 'inventory',
	direct = 'direct',
	consignment = 'consignment',
}

export type location_info = {
	floor?: number;
	building?: string;
	capacity?: number;
	responsible_department?: string;
	item_count?: number;
	last_count?: string;
};

export const LocationCreateSchema = z.object({
	id: z.string().uuid().optional(),
	name: z.string().min(1, 'name must be at least 1 character'),
	description: z.string().optional(),
	is_active: z.boolean().default(true).optional(),
	location_type: z.enum(
		Object.values(enum_location_type) as [string, ...string[]]
	),
	delivery_point_id: z.string().uuid().optional().nullable(),
	info: z
		.object({
			floor: z.number().optional(),
			building: z.string().optional(),
			capacity: z.number().optional(),
			responsible_department: z.string().optional(),
			item_count: z.number().optional(),
			last_count: z.string().optional(),
		})
		.optional()
		.nullable(),
	users: z
		.object({
			add: z.array(
				z.object({
					id: z.string().uuid(),
				})
			),
			delete: z.array(
				z.object({
					id: z.string().uuid(),
				})
			),
		})
		.optional(),
});

export type LocationCreateModel = z.infer<typeof LocationCreateSchema>;

export class LocationCreateDto implements LocationCreateModel {
	id?: string;
	name!: string;
	description?: string;
	is_active?: boolean;
	location_type!: enum_location_type;
	delivery_point_id?: string;
	info?: location_info;
}

export const LocationUpdateSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'name must be at least 1 character').optional(),
	description: z.string().nullable().optional(),
	is_active: z.boolean().default(true).nullable().optional(),
	location_type: z
		.enum(Object.values(enum_location_type) as [string, ...string[]])
		.optional(),
	delivery_point_id: z.string().uuid().nullable().optional(),
	info: z
		.object({
			floor: z.number().optional(),
			building: z.string().optional(),
			capacity: z.number().optional(),
			responsible_department: z.string().optional(),
			item_count: z.number().optional(),
			last_count: z.string().optional(),
		})
		.optional(),
});

export type LocationUpdateModel = z.infer<typeof LocationUpdateSchema>;

export class LocationUpdateDto implements LocationUpdateModel {
	id!: string;
	name!: string;
	description?: string | null;
	is_active?: boolean | null;
	location_type!: enum_location_type;
	delivery_point_id?: string | null;
	info?: location_info;
}

export type LocationDto = {
	id: string;
	store_name: string;
	store_code: string;
	address_line1: string;
	address_line2?: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
	phone_number: string;
	tax_number?: string;
	created_at: Date;
	updated_at: Date;
};

export type LocationData = {
	id?: string;
	location_id: string;
	location_name: string;
	location_type: string;
};

export interface LocationChanges {
	add: { location_id: string }[];
	edit: { location_id: string }[];
	delete: { location_id: string }[];
}

// export type LocationState = {
// 	location_id: string;
// };

export type StateType = {
	addedLocations: LocationState[];
	editedLocations: LocationState[];
	deletedLocations: LocationState[];
};

export const UserInfoSchema = z.object({
	firstname: z.string(),
	lastname: z.string(),
	middlename: z.string(),
});

export const UserLocationSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	userInfo: UserInfoSchema,
});
export type UserLocationModel = z.infer<typeof UserLocationSchema>;

export const UsersSchema = z.object({
	active: z.array(UserLocationSchema),
	inactive: z.array(UserLocationSchema),
});

const DeliveryPointSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
});

export const LocationSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string(),
	is_active: z.boolean(),
	location_type: z.enum(
		Object.values(enum_location_type) as [string, ...string[]]
	),
	delivery_point: DeliveryPointSchema,
	users: UsersSchema,
});

export type LocationsModel = z.infer<typeof LocationSchema>;

export interface LocationState {
	id: string;
	name: string;
	description: string;
	is_active: boolean;
	location_type: enum_location_type;
	delivery_point: {
		id: string;
		name: string;
	};
	users: {
		active: UserLocationModel[];
		inactive: UserLocationModel[];
	};
}
export const LocationPayloadSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string(),
	is_active: z.boolean(),
	location_type: z.nativeEnum(enum_location_type),
	deliveryPointId: z.string().uuid('Invalid delivery point ID'),
	user: z.object({
		add: z.array(
			z.object({
				user_id: z.string().uuid('Invalid user ID'),
			})
		),
		remove: z.array(
			z.object({
				user_id: z.string().uuid('Invalid user ID'),
			})
		),
	}),
	id: z.string().uuid('Invalid ID').optional(),
});

export type LocationPayload = z.infer<typeof LocationPayloadSchema>;

