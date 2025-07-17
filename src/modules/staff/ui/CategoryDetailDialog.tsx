"use client";

import { CalendarDays, FileText, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ICategory } from "@/interfaces/category";

interface CategoryDetailDialogProps {
	category: ICategory | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CategoryDetailDialog({ category, open, onOpenChange }: CategoryDetailDialogProps) {
	if (!category) {
		return null;
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Tag className="h-5 w-5" />
						Category Details
					</DialogTitle>
					<DialogDescription>Complete information about the selected category</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Basic Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-medium text-sm text-muted-foreground mb-2">Category Name</h3>
								<p className="text-lg font-semibold">{category.name}</p>
							</div>

							<Separator />

							<div>
								<h3 className="font-medium text-sm text-muted-foreground mb-2">Category ID</h3>
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="font-mono">
										{category.id}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Description */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Description
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm leading-relaxed text-muted-foreground">
								{category.description}
							</p>
						</CardContent>
					</Card>

					{/* Timestamps */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<CalendarDays className="h-4 w-4" />
								Timeline
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-sm text-muted-foreground mb-2">Created At</h3>
									<p className="text-sm">{formatDate(category.createdAt)}</p>
								</div>
								<div>
									<h3 className="font-medium text-sm text-muted-foreground mb-2">Last Updated</h3>
									<p className="text-sm">{formatDate(category.updatedAt)}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
