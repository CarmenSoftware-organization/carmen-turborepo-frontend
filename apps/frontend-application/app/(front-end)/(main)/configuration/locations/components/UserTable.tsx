import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableProps {
	users: {
		id: string;
		email: string;
		userInfo: {
			firstname: string;
			lastname: string;
			middlename: string;
		};
	}[];
	selectedUsers: string[];
	isEdit: boolean;
	onUserChange: (id: string) => void;
	title: string;
	onCheckAll?: (checked: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
	users,
	selectedUsers,
	isEdit,
	onUserChange,
	title,
	onCheckAll,
}) => {
	const handleCheckAll = (checked: boolean) => {
		onCheckAll?.(checked);
	};

	const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			callback();
		}
	};

	const isAllSelected =
		users.length > 0 && users.every((user) => selectedUsers.includes(user.id));

	return (
		<div className="w-full">
			<p
				className="text-sm font-semibold mb-2"
				data-id="user-table-title"
				role="heading"
				aria-level={2}
			>
				{title}
			</p>
			<div className="relative flex-1 w-full">
				<div className="rounded-md">
					<div className="w-full">
						<div className="border-b">
							<Table
								className="w-full"
								data-id="user-table"
								role="grid"
								aria-label="Users list"
							>
								{isEdit && (
									<TableHeader
										className="bg-background"
										data-id="user-table-header"
									>
										<TableRow data-id="user-table-row">
											{isEdit && (
												<TableHead
													className="w-[30px]"
													data-id="user-table-head-checkbox"
												>
													<Checkbox
														checked={isAllSelected}
														onCheckedChange={handleCheckAll}
														aria-label={`Select all ${users.length} users`}
														data-id="select-all-checkbox"
														onKeyDown={(e) =>
															handleKeyDown(e, () =>
																handleCheckAll(!isAllSelected)
															)
														}
													/>
												</TableHead>
											)}
											<TableHead
												className="w-1/3"
												data-id="user-table-head-full-name"
											>
												Full Name
											</TableHead>
											<TableHead data-id="user-table-head-email">
												Email
											</TableHead>
										</TableRow>
									</TableHeader>
								)}
							</Table>
						</div>
						<div className="overflow-y-auto max-h-[calc(51vh-80px)]">
							<Table
								className="w-full"
								data-id="user-table"
								aria-label="Users data"
							>
								<TableBody data-id="user-table-body">
									{users.length > 0 ? (
										users.map((user) => (
											<TableRow key={user.id} data-id="user-table-row">
												{isEdit && (
													<TableCell
														className="w-[30px]"
														data-id="user-table-cell"
													>
														<Checkbox
															id={user.id}
															checked={selectedUsers.includes(user.id)}
															onCheckedChange={() => onUserChange(user.id)}
															aria-label={`Select ${user.userInfo.firstname} ${user.userInfo.lastname}`}
															data-id="user-table-checkbox"
															onKeyDown={(e) =>
																handleKeyDown(e, () => onUserChange(user.id))
															}
														/>
													</TableCell>
												)}
												<TableCell
													className="font-medium w-1/3"
													data-id="user-table-cell"
												>
													{`${user.userInfo.firstname} ${user.userInfo.lastname}`}
												</TableCell>
												<TableCell data-id="user-table-cell">
													{user.email}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow data-id="user-table-row">
											<TableCell
												colSpan={isEdit ? 3 : 2}
												className="text-center"
												data-id="user-table-cell"
											>
												Empty.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserTable;
