import { NextResponse } from "next/server";

const mappingData = [
    {
        store: 'Mini Bar',
        category: 'Beverage',
        subCategory: 'Beers',
        itemGroup: 'Beer',
        department: '35',
        accountCode: '5000020',
    },
    { store: 'MIN1', category: '2', subCategory: '21', itemGroup: '2100', department: '35', accountCode: '5000020' },
    {
        store: 'Rooms - Housekeeping',
        category: 'Food',
        subCategory: 'Dry Goods',
        itemGroup: 'Coffee/Tea/Hot Bev.',
        department: '21',
        accountCode: '1116007',
    },
    { store: 'RH', category: '1', subCategory: '10', itemGroup: '1000', department: '21', accountCode: '1116007' },
    {
        store: 'A&G - Security',
        category: 'Beverage',
        subCategory: 'Soft Drink',
        itemGroup: 'Waters',
        department: '10',
        accountCode: '1111005',
    },
    { store: 'AGS', category: '2', subCategory: '20', itemGroup: '2001', department: '10', accountCode: '1111005' },
];

export async function GET() {
    return NextResponse.json({
        message: 'Account code mapping fetched successfully',
        data: mappingData
    });
}