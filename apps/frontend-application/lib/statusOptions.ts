import * as m from '@/paraglide/messages.js';

export const statusOptions = [
    { label: `${m.all_status()}`, value: '' },
    { label: `${m.status_active()}`, value: 'true' },
    { label: `${m.status_inactive()}`, value: 'false' },
];