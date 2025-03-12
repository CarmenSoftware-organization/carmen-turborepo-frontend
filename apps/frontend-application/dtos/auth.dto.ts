import { z } from 'zod';

//#region  Zod
export const authLoginSchema = z.object({
  username: z
    .string({
      required_error: 'Username field is required',
    })
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string({
      required_error: 'password field is required',
    })
    .min(3, 'Password must be at least 3 characters'),
});

export type AuthLoginModel = z.infer<typeof authLoginSchema>;

export const authChangePassword = z.object({
	old_pass: z.string({ required_error: 'request old password' }),
	new_pass: z.string({ required_error: 'request new password' }),
	confirm_pass: z.string({ required_error: 'request confirm password' }),
});

export type AuthChangePasswordModel = z.infer<typeof authChangePassword>;

//#endregion Zod

export class AuthPayloadDto {
	id?: string;
	username!: string;
	password!: string;
}

export class AuthLoginDto implements AuthLoginModel {
	username!: string;
	password!: string;
}

export class AuthChangePasswordDto implements AuthChangePasswordModel {
	old_pass!: string;
	new_pass!: string;
	confirm_pass!: string;
}

export class AuthLoginResponseDto {
  id?: string;
  username!: string;
  access_token!: string;
  refresh_token?: string;
}

export class UserRegisterDto {
	username!: string;
	email!: string;
	password!: string;
	email_token!: string;
	consent!: boolean;
	user_fnfo?: UserProfile;
}

export class UserProfile {
	first_name!: string;
	middle_name?: string;
	last_name!: string;
	bio?: JSON;
}

export class EmailDto {
	email!: string;
}

export class UserForgotPassDto {
	username!: string;
	password!: string;
	email_token!: string;
}
