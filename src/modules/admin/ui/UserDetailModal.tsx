"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/interfaces/user";
import { AccountRole } from "@/interfaces/authentication";
import { Mail, Phone, MapPin, Calendar, User } from "lucide-react";

interface UserDetailModalProps {
	user: IUser | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
	if (!user) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getRoleBadgeVariant = (role: AccountRole) => {
		switch (role) {
			case AccountRole.ADMIN:
				return "destructive";
			case AccountRole.STAFF:
				return "default";
			default:
				return "secondary";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>User Details</DialogTitle>
					<DialogDescription>Detailed information about {user.fullName}</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Profile Section */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								<Avatar className="h-16 w-16">
									<AvatarImage src={user.avatar} alt={user.fullName} className="object-cover" />
									<AvatarFallback className="text-lg">
										{user.fullName
											.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="text-xl font-semibold">{user.fullName}</h3>
									<Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
										{user.role}
									</Badge>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.email}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">{user.phoneNumber}</span>
								</div>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm capitalize">{user.gender || "Not specified"}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Address Section */}
					{user.address ? (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									Address Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div>
										<span className="font-medium">Street:</span> {user.address.street}
									</div>
									<div>
										<span className="font-medium">Ward:</span> {user.address.ward}
									</div>
									<div>
										<span className="font-medium">District:</span> {user.address.district}
									</div>
									<div>
										<span className="font-medium">City:</span> {user.address.city}
									</div>
									<div>
										<span className="font-medium">Country:</span> {user.address.country}
									</div>
								</div>
							</CardContent>
						</Card>
					) : (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									Address Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground">
									No address information available
								</div>
							</CardContent>
						</Card>
					)}

					{/* Account Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Calendar className="h-5 w-5" />
								Account Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<span className="font-medium text-sm">User ID:</span>
									<p className="text-sm text-muted-foreground mt-1 font-mono">{user.id}</p>
								</div>
								<Separator />
								<div>
									<span className="font-medium text-sm">Created At:</span>
									<p className="text-sm text-muted-foreground mt-1">{formatDate(user.createdAt)}</p>
								</div>
								<div>
									<span className="font-medium text-sm">Last Updated:</span>
									<p className="text-sm text-muted-foreground mt-1">{formatDate(user.updatedAt)}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
