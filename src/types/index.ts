export interface TypingStats {
	wpm: number;
	accuracy: number;
	totalChars: number;
	correctChars: number;
	incorrectChars: number;
	mistakeKeys: Record<string, number>;
}

export interface GameState {
	currentSentenceIndex: number;
	currentCharIndex: number;
	timeLeft: number;
	isGameActive: boolean;
	isGameFinished: boolean;
	stats: TypingStats;
	userInput: string;
}

export interface TwitterUser {
	username: string;
	displayName: string;
	avatar: string;
	timestamp: string;
}

export type RawPost = {
	id: string;
	edit_history_tweet_ids: string[];
	text: string;
};
