import { ClusterMemberFormValues, SettingsFormValues, UserPlatformFormValues } from "./form";

export const defaultSettingValues: SettingsFormValues = {
    general: {
        name: '',
        email: '',
        phone: '',
        address: {
            house_number: '',
            road: '',
            sub_district: '',
            district: '',
            province: '',
            postal_code: '',
        }
    },
    localization: {
        language: '',
        timezone: '',
    },
    maintenance: {
        enabled: false,
        message: '',
    }
};

export const defaultClusterMemberValues: ClusterMemberFormValues = {
    name: '',
    email: '',
    platform: '',
    role: '',
    business_unit: [],
};

export const defaultUserPlatformValues: UserPlatformFormValues = {
    name: '',
    email: '',
    role: [{
        id: '',
        name: '',
    }],
    modules: [{
        id: '',
        name: '',
        status: true,
    }],
    business_unit: [{
        id: '',
        name: '',
    }],
    status: false,
    last_active: '',
    created_at: '',
    updated_at: '',
};

