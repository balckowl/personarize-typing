"use client";

import { TypingGame } from "@/components/game/TypingGame";
import { useTypingGame } from "@/hooks/useTypingGame";

export default function page() {
	const { gameState, resetGame } = useTypingGame();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-8">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 text-center">
						<h1 className="mb-2 font-bold text-3xl text-gray-900">タイピングゲーム</h1>
						{!gameState.isGameFinished && (
							<p className="text-gray-600">表示される文章を正確にタイピングしてください</p>
						)}
					</div>

					{gameState.isGameFinished ? <div>結果</div> : <TypingGame />}
				</div>
			</div>
		</div>
	);
}
