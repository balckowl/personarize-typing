import type { TwitterUser } from "@/types";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

interface TwitterPostProps {
	user: TwitterUser;
	children: React.ReactNode;
}

export const TwitterPost: React.FC<TwitterPostProps> = ({ user, children }) => {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-start space-x-3">
				<img
					src={user.avatar}
					alt={user.displayName}
					className="h-12 w-12 rounded-full object-cover"
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-center space-x-2">
						<h3 className="truncate font-bold text-gray-900">{user.displayName}</h3>
						<span className="text-gray-500 text-sm">{user.username}</span>
						<span className="text-gray-500 text-sm">·</span>
						<span className="text-gray-500 text-sm">{user.timestamp}</span>
					</div>
					<div className="mt-3">{children}</div>
					<div className="mt-4 flex max-w-md items-center justify-between">
						<button
							type="button"
							className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-blue-500"
						>
							<div className="rounded-full p-2 transition-colors group-hover:bg-blue-50">
								<MessageCircle size={18} />
							</div>
							<span className="text-sm">24</span>
						</button>
						<button
							type="button"
							className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-green-500"
						>
							<div className="rounded-full p-2 transition-colors group-hover:bg-green-50">
								<Repeat2 size={18} />
							</div>
							<span className="text-sm">12</span>
						</button>
						<button
							type="button"
							className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-red-500"
						>
							<div className="rounded-full p-2 transition-colors group-hover:bg-red-50">
								<Heart size={18} />
							</div>
							<span className="text-sm">89</span>
						</button>
						<button
							type="button"
							className="group flex items-center space-x-2 text-gray-500 transition-colors hover:text-blue-500"
						>
							<div className="rounded-full p-2 transition-colors group-hover:bg-blue-50">
								<Share size={18} />
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
