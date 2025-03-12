'use client';

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui-custom/dialog';

import { Button } from '@/components/ui/button';
import React from 'react';

export default function DialogPage() {
	const content = (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Open Dialog</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-4xl w-4/5'>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
					</DialogHeader>

					<div className='h-[1000px] w-full bg-green-300'>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat, aliquam! Molestiae porro et molestias aut
						dolorem fugiat voluptates, cum vitae eligendi vero assumenda. Quibusdam tenetur, dolorum sequi accusantium
						enim nostrum?
					</div>

					<DialogFooter>
						<Button variant='outline'>Cancel</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
	return <>{content}</>;
}
