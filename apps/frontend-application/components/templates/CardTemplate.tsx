import React, { ReactNode } from 'react';

interface IProps {
	title: string;
	content?: ReactNode;
}

export default function CardTemplate({ title, content }: IProps) {
	return (
		<div className='flex flex-col items-center justify-center w-full h-full rounded-lg shadow-lg'>
			<div className='text-2xl font-bold mb-4'>{title}</div>
			{content}
		</div>
	);
}
