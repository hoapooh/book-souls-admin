"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStaffAuth } from "../hooks/useAuth";
import { useStaffAuthStore } from "../stores/auth.store";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const StaffLoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoading } = useStaffAuth();
	const { error } = useStaffAuthStore();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormData) => {
		login(data);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
			<Card className="w-full max-w-md shadow-xl">
				<CardHeader className="space-y-1 text-center">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-green-100 rounded-full">
							<User className="h-8 w-8 text-green-600" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">Staff Portal</CardTitle>
					<CardDescription className="text-gray-600">
						Sign in to access the staff dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Input
									id="email"
									type="email"
									placeholder="staff@example.com"
									className="pl-10"
									{...register("email")}
								/>
								<User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
							</div>
							{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									className="pl-10 pr-10"
									{...register("password")}
								/>
								<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<button
									type="button"
									className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
							{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
						</div>

						<div className="space-y-3">
							<Button
								type="submit"
								className="w-full bg-green-600 hover:bg-green-700"
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => router.push("/")}
							>
								Go to Home
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
