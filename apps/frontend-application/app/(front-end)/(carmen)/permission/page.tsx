'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { hasPermission, ResourceType, UserType } from './policy';
import { mockComments, mockUsers } from './mockData';

const PermissionPage = () => {
	const adminUser: UserType = { id: '1', role: 'admin', subRole: 'boss' };
	const supportBossBU1: UserType = {
		id: '2',
		role: 'support',
		subRole: 'boss',
		bu: 'BU1',
	};
	const supportSubordinateBU1: UserType = {
		id: '3',
		role: 'support',
		subRole: 'subordinate',
		bu: 'BU1',
	};
	const userBossBU1: UserType = {
		id: '4',
		role: 'user',
		subRole: 'boss',
		bu: 'BU1',
	};
	const userSubordinateBU1: UserType = {
		id: '5',
		role: 'user',
		subRole: 'subordinate',
		bu: 'BU1',
	};
	const supportBossBU2: UserType = {
		id: '6',
		role: 'support',
		subRole: 'boss',
		bu: 'BU2',
	};
	const userSubordinateBU2: UserType = {
		id: '9',
		role: 'user',
		subRole: 'subordinate',
		bu: 'BU2',
	};

	const userBossBU2: UserType = {
		id: '8',
		role: 'user',
		subRole: 'boss',
		bu: 'BU3',
	};

	const [user, setUser] = useState<UserType>(adminUser);
	const [comments, setComments] = useState<ResourceType[]>(mockComments);
	const [editingComment, setEditingComment] = useState<ResourceType | null>(
		null
	);

	// Filter comments based on user's permissions
	const visibleComments = comments.filter((comment) =>
		hasPermission(user, 'read:comments', comment)
	);

	const handleCreate = () => {
		if (!user.bu && user.role !== 'admin') {
			alert('คุณไม่มีสิทธิ์สร้างความคิดเห็น เนื่องจากไม่มี BU');
			return;
		}

		const newComment: ResourceType = {
			id: (comments.length + 1).toString(),
			ownerId: user.id,
			bu: user.bu || 'BU1',
			visibility: 'public',
			content: 'New Comment',
		};
		setComments([...comments, newComment]);
	};

	const handleUpdate = (commentId: string, newContent: string) => {
		const commentToUpdate = comments.find((c) => c.id === commentId);

		if (
			commentToUpdate &&
			hasPermission(user, 'update:comments', commentToUpdate)
		) {
			const updatedComments = comments.map((comment) =>
				comment.id === commentId ? { ...comment, content: newContent } : comment
			);
			setComments(updatedComments);
			setEditingComment(null);
		} else {
			alert('คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้');
		}
	};

	const handleDelete = (commentId: string) => {
		const commentToDelete = comments.find((c) => c.id === commentId);

		if (!commentToDelete) return;

		// Check if user has permission to delete
		const canDelete =
			hasPermission(user, 'delete:comments', commentToDelete) ||
			hasPermission(user, 'delete:ownComments', commentToDelete) ||
			hasPermission(user, 'delete:subordinateComments', commentToDelete);

		if (!canDelete) {
			alert('คุณไม่มีสิทธิ์ลบความคิดเห็นนี้');
			return;
		}

		let deleteType = 'Delete';
		if (hasPermission(user, 'delete:comments', commentToDelete)) {
			deleteType = 'Admin/Support Delete';
		} else if (
			hasPermission(user, 'delete:subordinateComments', commentToDelete)
		) {
			deleteType = 'Boss Delete';
		} else if (hasPermission(user, 'delete:ownComments', commentToDelete)) {
			deleteType = 'Own Delete';
		}

		if (
			confirm(`Are you sure you want to delete this comment? (${deleteType})`)
		) {
			const newComments = comments.filter(
				(comment) => comment.id !== commentId
			);
			setComments(newComments);
		}
	};

	// Helper function to get user role display
	const getUserRoleDisplay = (user: UserType) => {
		const roleParts = [
			user.role.charAt(0).toUpperCase() + user.role.slice(1),
			user.subRole &&
			user.subRole.charAt(0).toUpperCase() + user.subRole.slice(1),
			user.bu && `(${user.bu})`,
		].filter(Boolean);
		return roleParts.join(' ');
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="space-y-6">
				{/* User Info Section */}
				<div className="bg-slate-100 p-4 rounded-lg">
					<h2 className="text-lg font-bold mb-2">Current User</h2>
					<div className="flex items-center gap-2">
						<span className="px-2 py-1 bg-blue-100 rounded">
							{getUserRoleDisplay(user)}
						</span>
						<span className="px-2 py-1 bg-gray-100 rounded">ID: {user.id}</span>
					</div>
				</div>

				{/* User Selection */}
				<Button onClick={() => setUser(adminUser)}>Admin (Boss)</Button>
				<div className="flex flex-wrap gap-2">
					<Button onClick={() => setUser(supportBossBU1)}>
						Support Boss (BU1)
					</Button>
					<Button onClick={() => setUser(supportSubordinateBU1)}>
						Support Staff (BU1)
					</Button>
					<Button onClick={() => setUser(userBossBU1)}>User Boss (BU1)</Button>
					<Button onClick={() => setUser(userSubordinateBU1)}>
						User Staff (BU1)
					</Button>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button onClick={() => setUser(supportBossBU2)}>
						Support Boss (BU2)
					</Button>
					<Button onClick={() => setUser(supportBossBU2)}>
						Support Boss (BU2)
					</Button>
					<Button onClick={() => setUser(userBossBU2)}>User Boss (BU2)</Button>
					<Button onClick={() => setUser(userSubordinateBU2)}>
						User Staff (BU2)
					</Button>
				</div>

				{/* Comments Table */}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Content</TableHead>
								<TableHead>BU</TableHead>
								<TableHead>Visibility</TableHead>
								<TableHead>Owner</TableHead>
								<TableHead>Owner Role</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleComments.map((comment) => {
								const commentOwner = mockUsers.find(
									(u) => u.id === comment.ownerId
								);
								return (
									<TableRow key={comment.id}>
										<TableCell>{comment.id}</TableCell>
										<TableCell>{comment.content}</TableCell>
										<TableCell>
											<span className="px-2 py-1 bg-gray-100 rounded">
												{comment.bu}
											</span>
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded ${comment.visibility === 'public'
													? 'bg-green-100'
													: 'bg-yellow-100'
													}`}
											>
												{comment.visibility}
											</span>
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded ${comment.ownerId === user.id
													? 'bg-blue-100'
													: 'bg-gray-100'
													}`}
											>
												{comment.ownerId === user.id ? 'You' : comment.ownerId}
											</span>
										</TableCell>
										<TableCell>
											<span className="px-2 py-1 bg-purple-100 rounded">
												{commentOwner
													? getUserRoleDisplay(commentOwner)
													: 'Unknown'}
											</span>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												{hasPermission(user, 'update:comments', comment) && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => setEditingComment(comment)}
													>
														{comment.ownerId === user.id ? 'Edit Own' : 'Edit'}
													</Button>
												)}
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleDelete(comment.id)}
												>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{/* Create Comment Button - only show if user has permission */}
				<div className="mt-4">
					{hasPermission(user, 'create:comments', mockComments[0]) && (
						<Button onClick={handleCreate}>Create New Comment</Button>
					)}
				</div>
			</div>

			{/* Edit Modal */}
			{editingComment && (
				<div className="fixed inset-0 bg-black bg-opacity-50 all-center">
					<Card className="w-96 p-4">
						<CardHeader>Edit Comment</CardHeader>
						<CardContent>
							<Input
								defaultValue={editingComment.content}
								id="comment-content"
								placeholder="Enter new comment content"
							/>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline" onClick={() => setEditingComment(null)}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									const newContent = (
										document.getElementById(
											'comment-content'
										) as HTMLInputElement
									).value;
									handleUpdate(editingComment.id, newContent);
								}}
							>
								Save
							</Button>
						</CardFooter>
					</Card>
				</div>
			)}
		</div>
	);
};

export default PermissionPage;
