import { format } from 'date-fns';

export enum TypeDateKey {
    DATE = 'date',
    INVOICE_DATE = 'invoiceDate',
    ORDER_DATE = 'orderDate',
    DELI_DATE = 'deliveryDate',
    CREATE_DATE = 'createdDate',
    DOC_DATE = 'docDate'
}

export const dateKeys = [
    TypeDateKey.DATE,
    TypeDateKey.INVOICE_DATE,
    TypeDateKey.ORDER_DATE,
    TypeDateKey.DELI_DATE,
    TypeDateKey.CREATE_DATE,
    TypeDateKey.DOC_DATE
];

export const formatDateCustom = (dateString: string | Date) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return '-';
    }
    return format(date, process.env.NEXT_PUBLIC_SHORT_DATE_FORMAT || 'dd MMM yyyy');
};