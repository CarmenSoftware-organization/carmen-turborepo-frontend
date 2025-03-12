'use client';
import React, { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/app/context/AuthContext';
import { toastError, toastSuccess } from '../ui-custom/Toast';

const TenantList = () => {
	const { tenant, tenantId, setTenantId, accessToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const token = accessToken || '';

	useEffect(() => {
		if (tenant?.length && !tenantId) {
			const defaultTenant = tenant.find((t) => t.is_default) || tenant[0];
			setTenantId(defaultTenant.id);
		}
	}, [tenant, tenantId, setTenantId]);

	const updateDefaultBusinessUnit = async (tenantId: string) => {
		const response = await fetch('/api/system/business-unit/default', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('API Error:', {
				status: response.status,
				statusText: response.statusText,
				data: errorData,
			});
			throw new Error(
				`Failed to update default business unit: ${response.statusText}`
			);
		}

		return await response.json();
	};

	const handleTenantChange = async (tenantId: string) => {
		setTenantId(tenantId);
		setIsLoading(true);
		try {
			console.log('tenantId ssss', tenantId);
			await updateDefaultBusinessUnit(tenantId);
			toastSuccess({ message: 'Default business unit updated successfully' });
		} catch (error) {
			toastError({ message: 'Failed to update default business unit' });
			console.error('Error updating default business unit:', error);
		} finally {
			setIsLoading(false);
		}
	};

	if (!tenant?.length) {
		return null;
	}

	return (
		<Select
			value={tenantId}
			onValueChange={handleTenantChange}
			disabled={isLoading}
			data-id="tenant-list-select"
		>
			<SelectTrigger
				className="w-full md:w-[300px] disabled:opacity-50 disabled:cursor-not-allowed"
				data-id="tenant-list-select-trigger"
			>
				<SelectValue
					placeholder="Business Unit"
					data-id="tenant-list-select-value"
				/>
			</SelectTrigger>
			<SelectContent data-id="tenant-list-select-content">
				{tenant.map((item) => (
					<SelectItem
						key={item.id}
						value={item.id}
						data-id="tenant-list-select-item"
					>
						{item.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default TenantList;
