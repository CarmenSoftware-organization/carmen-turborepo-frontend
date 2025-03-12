import { Link } from '@/lib/i18n';
import { home_subtitle, home_title, signIn_title } from '@/paraglide/messages';
import React from 'react';

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 data-id="home-title" className="text-4xl font-bold mb-4">
				{home_title()}
			</h1>
			<p data-id="home-subtitle" className="text-xl mb-8">
				{home_subtitle()}
			</p>
			<div className="space-x-4">
				<Link
					href="/sign-in"
					data-id="sign-in-link"
					className="py-2 px-4 rounded-xl border"
				>
					{signIn_title()}
				</Link>
			</div>
		</div>
	);
};

export default HomePage;