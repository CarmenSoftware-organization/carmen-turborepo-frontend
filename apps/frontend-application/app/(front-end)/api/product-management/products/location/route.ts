import { NextResponse } from 'next/server';

export const GET = async () => {
	try {
		return NextResponse.json({
			message: 'Location fetched successfully',
			data: {
				id: '1',
				name: 'Location 1',
			},
		});
	} catch (error) {
		console.error('Error occurred:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error', error },
			{ status: 500 }
		);
	}
};
