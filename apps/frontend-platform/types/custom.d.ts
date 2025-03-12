// Custom type declarations

declare module '@/components/UserPlatformForm' {
    import { z } from 'zod';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const formSchema: z.ZodObject<any>;

    export type FormValues = {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        department: string;
        bio?: string;
        avatar?: string;
    };

    export interface UserPlatformFormProps {
        onSubmit?: (data: FormValues) => void;
        initialValues?: Partial<FormValues>;
        id?: string;
    }

    export const UserPlatformForm: React.FC<UserPlatformFormProps>;
} 