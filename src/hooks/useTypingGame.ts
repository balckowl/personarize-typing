import { getExpectedRomaji } from "@/lib/romaji";
import { useCallback, useEffect, useState } from "react";

export type GameState = {
	currentSentenceIndex: number;
	currentCharIndex: number;
	timeLeft: number;
	isGameActive: boolean;
	isGameFinished: boolean;
	stats: {
		wpm: number;
		accuracy: number;
		totalChars: number;
		correctChars: number;
		incorrectChars: number;
		mistakeKeys: Record<string, number>;
	};
	userInput: string;
};

export const useTypingGame = (sentences: string[]) => {
	const GAME_DURATION = 100; // 秒

	const [gameState, setGameState] = useState<GameState>({
		currentSentenceIndex: 0,
		currentCharIndex: 0,
		timeLeft: GAME_DURATION,
		isGameActive: false,
		isGameFinished: false,
		stats: {
			wpm: 0,
			accuracy: 0,
			totalChars: 0,
			correctChars: 0,
			incorrectChars: 0,
			mistakeKeys: {},
		},
		userInput: "",
	});
	const [currentInput, setCurrentInput] = useState("");
	const [romajiProgress, setRomajiProgress] = useState<{ char: string; isCorrect: boolean }[]>([]);
	const [currentRomajiIndex, setCurrentRomajiIndex] = useState(0);
	const [incorrectChars, setIncorrectChars] = useState<Set<number>>(new Set());

	const calculateWPM = useCallback((correctChars: number, timeElapsed: number) => {
		if (timeElapsed === 0) return 0;
		const words = correctChars / 5;
		const minutes = timeElapsed / 60;
		return Math.round(words / minutes);
	}, []);

	const calculateAccuracy = useCallback((correct: number, total: number) => {
		if (total === 0) return 100;
		return Math.round((correct / total) * 100);
	}, []);

	const startGame = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			isGameActive: true,
			isGameFinished: false,
			timeLeft: GAME_DURATION,
			currentSentenceIndex: 0,
			currentCharIndex: 0,
			userInput: "",
			stats: {
				wpm: 0,
				accuracy: 0,
				totalChars: 0,
				correctChars: 0,
				incorrectChars: 0,
				mistakeKeys: {},
			},
		}));
		setCurrentInput("");
		setRomajiProgress([]);
		setCurrentRomajiIndex(0);
		setIncorrectChars(new Set());
	}, []);

	const finishGame = useCallback(() => {
		setGameState((prev) => {
			const timeElapsed = GAME_DURATION - prev.timeLeft;
			const wpm = calculateWPM(prev.stats.correctChars, timeElapsed);
			const accuracy = calculateAccuracy(prev.stats.correctChars, prev.stats.totalChars);
			return {
				...prev,
				isGameActive: false,
				isGameFinished: true,
				stats: { ...prev.stats, wpm, accuracy },
			};
		});
		setCurrentInput("");
		setRomajiProgress([]);
		setCurrentRomajiIndex(0);
		setIncorrectChars(new Set());
	}, [calculateWPM, calculateAccuracy]);

	const isSkippableCharacter = useCallback((char: string) => {
		const emojiRegex =
			/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
		const kaomoji = /[（）()><^\\-_=;:｡\.\*\+\-\~\|\/\\]/;
		return emojiRegex.test(char) || kaomoji.test(char);
	}, []);

	const getNextValidCharIndex = useCallback(
		(sentence: string, startIndex: number) => {
			for (let i = startIndex; i < sentence.length; i++) {
				if (!isSkippableCharacter(sentence[i])) return i;
			}
			return sentence.length;
		},
		[isSkippableCharacter],
	);

	const handleKeyPress = useCallback(
		(char: string) => {
			if (!gameState.isGameActive) return;

			const sentence = sentences[gameState.currentSentenceIndex];
			const idx = getNextValidCharIndex(sentence, gameState.currentCharIndex);
			// 文の最後を越えたら次へ
			if (idx >= sentence.length) {
				const nextI = (gameState.currentSentenceIndex + 1) % sentences.length;
				const nextChar = getNextValidCharIndex(sentences[nextI], 0);
				setGameState((prev) => ({
					...prev,
					currentSentenceIndex: nextI,
					currentCharIndex: nextChar,
					userInput: "",
				}));
				setCurrentInput("");
				setRomajiProgress([]);
				setCurrentRomajiIndex(0);
				setIncorrectChars(new Set());
				return;
			}

			const expectedChar = sentence[idx];
			const romajis = getExpectedRomaji(expectedChar)[0] || expectedChar;
			const expected = romajis[currentRomajiIndex];
			const isCorrect = char === expected;

			if (!isCorrect) {
				setIncorrectChars((s) => new Set(s).add(idx));
				setGameState((s) => ({
					...s,
					stats: {
						...s.stats,
						totalChars: s.stats.totalChars + 1,
						incorrectChars: s.stats.incorrectChars + 1,
					},
				}));
				return;
			}

			// 正解処理
			setIncorrectChars((s) => {
				const copy = new Set(s);
				copy.delete(idx);
				return copy;
			});

			setRomajiProgress((prev) => [
				...prev.slice(0, currentRomajiIndex),
				{ char, isCorrect: true },
				...prev.slice(currentRomajiIndex + 1),
			]);

			const nextRomaji = currentRomajiIndex + 1;
			const complete = nextRomaji >= romajis.length;

			setGameState((prev) => {
				const newStats = {
					...prev.stats,
					totalChars: prev.stats.totalChars + 1,
					correctChars: complete ? prev.stats.correctChars + 1 : prev.stats.correctChars,
				};
				let newIdx = prev.currentCharIndex;
				let newInput = prev.userInput;
				let sentIndex = prev.currentSentenceIndex;

				if (complete) {
					newIdx += 1;
					newInput += expectedChar;
					if (newIdx >= sentence.length) {
						sentIndex = (sentIndex + 1) % sentences.length;
						newIdx = 0;
						newInput = "";
					}
				}

				return {
					...prev,
					currentSentenceIndex: sentIndex,
					currentCharIndex: newIdx,
					stats: newStats,
					userInput: newInput,
				};
			});

			if (complete) {
				setCurrentRomajiIndex(0);
				setRomajiProgress([]);
			} else {
				setCurrentRomajiIndex(nextRomaji);
			}
		},
		[gameState, sentences, currentRomajiIndex, getNextValidCharIndex],
	);

	// タイマー
	useEffect(() => {
		if (!gameState.isGameActive || gameState.timeLeft <= 0) return;
		const timer = setInterval(() => {
			setGameState((prev) => {
				if (prev.timeLeft <= 1) {
					clearInterval(timer);
					finishGame();
					return { ...prev, timeLeft: 0 };
				}
				return { ...prev, timeLeft: prev.timeLeft - 1 };
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [gameState.isGameActive, gameState.timeLeft, finishGame]);

	return {
		gameState,
		currentInput,
		romajiProgress,
		currentRomajiIndex,
		startGame,
		handleKeyPress,
		resetGame: startGame,
		finishGame,
		incorrectChars,
		isSkippableCharacter,
		currentSentence: sentences[gameState.currentSentenceIndex],
	};
};
