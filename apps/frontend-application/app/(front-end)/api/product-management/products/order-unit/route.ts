import { NextResponse } from 'next/server';

export const GET = async () => {
	return NextResponse.json({ message: 'Order unit fetched successfully' });
};
