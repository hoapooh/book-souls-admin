import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users } from "lucide-react";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
			<div className="max-w-4xl mx-auto text-center">
				<div className="mb-12">
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Book Souls</h1>
					<p className="text-xl text-gray-600 mb-8">Staff & Admin Management Portal</p>
					<p className="text-gray-500 max-w-2xl mx-auto">
						Choose your portal to access the Book Souls management system. Administrators can manage
						the entire system while staff members can handle day-to-day operations.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
					<Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<div className="p-4 bg-blue-100 rounded-full">
									<Shield className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<CardTitle className="text-2xl text-gray-900">Admin Portal</CardTitle>
							<CardDescription className="text-gray-600">
								Full system access and management capabilities
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/admin/login">
								<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg cursor-pointer">
									Enter Admin Portal
								</Button>
							</Link>
						</CardContent>
					</Card>

					<Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200">
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<div className="p-4 bg-green-100 rounded-full">
									<Users className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<CardTitle className="text-2xl text-gray-900">Staff Portal</CardTitle>
							<CardDescription className="text-gray-600">
								Manage daily operations and customer service
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/staff/login">
								<Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg cursor-pointer">
									Enter Staff Portal
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
