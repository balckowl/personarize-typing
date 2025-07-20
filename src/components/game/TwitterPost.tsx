// components/ui/TwitterPost.tsx
"use client";

import { Heart, MessageCircle, Repeat2, Share, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
	userIcon?: string;
	timeLeft: number;
	displayName: string;
	children: React.ReactNode;
	userName: string;
	mock?: boolean;
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}分${secs.toString().padStart(2, "0")}秒間`;
};

export const TwitterPost = ({
	userIcon,
	displayName,
	userName,
	children,
	timeLeft,
	mock = false,
}: Props) => {
	return (
		<div className={"border-r border-b border-l bg-white px-8 py-6 transition-all"}>
			<div className={`${mock && "pointer-events-none opacity-50 grayscale filter"}`}>
				<div className="flex items-start space-x-3">
					<Avatar className="h-12 w-12 border">
						<AvatarImage src={userIcon} alt={displayName} width={48} height={48} />
						<AvatarFallback>
							<User />
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<div className="flex items-center space-x-2">
							<h3 className="truncate font-bold text-gray-900">{displayName}</h3>
							<span className="text-gray-500 text-sm">@{userName}</span>
							<span className="text-gray-500 text-sm">·</span>
							<span className="text-gray-500 text-sm">
								{!mock ? `${formatTime(timeLeft)}` : `${timeLeft}分間`}
							</span>
						</div>
						<div className="mt-3">{children}</div>
						<div className="mt-4 flex max-w-md items-center justify-between">
							<button
								type="button"
								className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-blue-500"
							>
								<div className="rounded-full px-2 transition-colors group-hover:bg-blue-50">
									<MessageCircle size={18} />
								</div>
								<span className="text-sm">24</span>
							</button>
							<button
								type="button"
								className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-green-500"
							>
								<div className="rounded-full px-2 transition-colors group-hover:bg-green-50">
									<Repeat2 size={18} />
								</div>
								<span className="text-sm">12</span>
							</button>
							<button
								type="button"
								className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-red-500"
							>
								<div className="rounded-full px-2 transition-colors group-hover:bg-red-50">
									<Heart size={18} />
								</div>
								<span className="text-sm">89</span>
							</button>
							<button
								type="button"
								className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-blue-500"
							>
								<div className="rounded-full px-2 transition-colors group-hover:bg-blue-50">
									<Share size={18} />
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
