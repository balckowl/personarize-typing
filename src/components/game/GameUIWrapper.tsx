"use client";

import { TypingGame } from "@/components/game/TypingGame";
import { useTypingGame } from "@/hooks/useTypingGame";
import type { ResponseTweetsSchemaType } from "@/server/schemas/user.schema";
import { Result } from "./Result";

type Props = {
	userIcon: string | undefined;
	displayName: string;
	userName: string;
	tweets: ResponseTweetsSchemaType;
	sentences: string[];
};

export default function GameUIWrapper({
	userIcon,
	displayName,
	tweets,
	userName,
	sentences,
}: Props) {
	const {
		gameState,
		startGame,
		handleKeyPress,
		resetGame,
		currentSentence,
		romajiProgress,
		currentRomajiIndex,
		incorrectChars,
		isSkippableCharacter,
	} = useTypingGame(sentences);

	return (
		<div className="flex h-screen items-center justify-center ">
			<div className="container mx-auto">
				<div className="mx-auto max-w-4xl">
					{gameState.isGameFinished ? (
						<Result stats={gameState.stats} onRestart={resetGame} />
					) : (
						<TypingGame
							userIcon={userIcon}
							displayName={displayName}
							userName={userName}
							tweets={tweets}
							gameState={gameState}
							startGame={startGame}
							handleKeyPress={handleKeyPress}
							currentSentence={currentSentence}
							romajiProgress={romajiProgress}
							currentRomajiIndex={currentRomajiIndex}
							incorrectChars={incorrectChars}
							isSkippableCharacter={isSkippableCharacter}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
