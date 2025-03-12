'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const RefreshToken = () => {
	const { authState, updateAccessToken, accessToken, tenantId } = useAuth();
	const { refresh_token } = authState;
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [oldToken, setOldToken] = useState(accessToken);
	const token = accessToken || '';

	const handleRefreshToken = async () => {
		try {
			setIsLoading(true);
			setOldToken(token);

			const response = await fetch('/api/auth/refresh-token', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'x-tenant-id': tenantId || '',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refresh_token: refresh_token }),
			});

			if (!response.ok) {
				throw new Error('Failed to refresh token');
			}

			const data = await response.json();
			console.log('data >>>', data);

			updateAccessToken(data.access_token);
			setOpen(false);
			toast.success('Token refreshed successfully');
		} catch (error) {
			console.error('Error:', error);
			toast.error('Failed to refresh token');
		} finally {
			setIsLoading(false);
		}
	};

	const TokenDisplay = ({ label, token }: { label: string; token: string }) => (
		<Card className="w-full">
			<CardContent className="pt-4">
				<p className="font-medium text-sm mb-2">{label}</p>
				<p className="text-xs break-all text-muted-foreground font-mono">
					{token || 'No token available'}
				</p>
			</CardContent>
		</Card>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" data-id="refresh-token-button">
					Refresh Token
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Refresh Token</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-4">
						<TokenDisplay label="Current Access Token" token={token} />
						{oldToken && oldToken !== token && (
							<TokenDisplay label="Previous Access Token" token={oldToken} />
						)}
						<TokenDisplay label="Refresh Token" token={refresh_token} />
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isLoading}
							data-id="cancel-button"
						>
							Cancel
						</Button>
						<Button
							onClick={handleRefreshToken}
							disabled={isLoading}
							data-id="refresh-button"
						>
							{isLoading ? 'Refreshing...' : 'Refresh Token'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default RefreshToken;
