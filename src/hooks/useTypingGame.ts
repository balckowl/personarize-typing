import { sentences } from "@/data/sentence";
import { getExpectedRomaji } from "@/lib/romaji";
import type { GameState } from "@/types";
import { useCallback, useEffect, useState } from "react";

const GAME_DURATION = 90; // 1分30秒

export const useTypingGame = () => {
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

	// 現在の文字に対する入力状態を管理
	const [currentInput, setCurrentInput] = useState("");
	const [romajiProgress, setRomajiProgress] = useState<Array<{ char: string; isCorrect: boolean }>>(
		[],
	);
	const [currentRomajiIndex, setCurrentRomajiIndex] = useState(0);

	const calculateWPM = useCallback((correctChars: number, timeElapsed: number) => {
		if (timeElapsed === 0) return 0;
		const words = correctChars / 5; // 5文字 = 1単語として計算
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
		}));
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
				stats: {
					...prev.stats,
					wpm,
					accuracy,
				},
			};
		});
		setCurrentInput("");
		setRomajiProgress([]);
		setCurrentRomajiIndex(0);
	}, [calculateWPM, calculateAccuracy]);

	// 絵文字や顔文字をスキップする関数
	const isSkippableCharacter = useCallback((char: string) => {
		// 絵文字の範囲をチェック
		const emojiRegex =
			/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
		// 顔文字の一般的なパターン
		const kaomoji = /[（）()（）\(\)><\^\-_=;:｡\.\*\+\-\~\|\/\\]/;

		return emojiRegex.test(char) || kaomoji.test(char);
	}, []);

	// 次の有効な文字のインデックスを取得
	const getNextValidCharIndex = useCallback(
		(sentence: string, startIndex: number) => {
			for (let i = startIndex; i < sentence.length; i++) {
				if (!isSkippableCharacter(sentence[i])) {
					return i;
				}
			}
			return sentence.length; // 文章の終わり
		},
		[isSkippableCharacter],
	);

	// 間違った文字の状態を管理
	const [incorrectChars, setIncorrectChars] = useState<Set<number>>(new Set());

	const handleKeyPress = useCallback(
		(char: string) => {
			if (!gameState.isGameActive) return;

			const currentSentence = sentences[gameState.currentSentenceIndex];
			let currentCharIndex = gameState.currentCharIndex;

			// スキップ可能な文字をスキップ
			currentCharIndex = getNextValidCharIndex(currentSentence, currentCharIndex);

			if (currentCharIndex >= currentSentence.length) {
				// 文章完成、次の文章へ
				const nextSentenceIndex = (gameState.currentSentenceIndex + 1) % sentences.length;
				const nextCharIndex = getNextValidCharIndex(sentences[nextSentenceIndex], 0);

				setGameState((prev) => ({
					...prev,
					currentSentenceIndex: nextSentenceIndex,
					currentCharIndex: nextCharIndex,
					userInput: "",
				}));
				setCurrentInput("");
				setCurrentRomajiIndex(0);
				setRomajiProgress([]);
				setIncorrectChars(new Set());
				return;
			}

			const expectedChar = currentSentence[currentCharIndex];
			const expectedRomaji = getExpectedRomaji(expectedChar);

			// 現在入力すべきローマ字文字を取得
			const expectedRomajiChar = expectedRomaji[0][currentRomajiIndex];
			const isCorrectChar = char === expectedRomajiChar;

			// 間違った場合の処理
			if (!isCorrectChar) {
				// 現在の文字を間違いとしてマーク
				setIncorrectChars((prev) => new Set(prev).add(currentCharIndex));

				setGameState((prev) => ({
					...prev,
					stats: {
						...prev.stats,
						totalChars: prev.stats.totalChars + 1,
						incorrectChars: prev.stats.incorrectChars + 1,
						mistakeKeys: {
							...prev.stats.mistakeKeys,
							[char]: (prev.stats.mistakeKeys[char] || 0) + 1,
						},
					},
				}));
				return;
			}

			// 正解の場合、間違いマークを削除
			setIncorrectChars((prev) => {
				const newSet = new Set(prev);
				newSet.delete(currentCharIndex);
				return newSet;
			});

			// 正解の場合
			setRomajiProgress((prev) => [
				...prev.slice(0, currentRomajiIndex),
				{ char, isCorrect: true },
				...prev.slice(currentRomajiIndex + 1),
			]);

			const nextRomajiIndex = currentRomajiIndex + 1;
			const isCharComplete = nextRomajiIndex >= expectedRomaji[0].length;

			setGameState((prev) => {
				const newStats = {
					...prev.stats,
					totalChars: prev.stats.totalChars + 1,
					correctChars: isCharComplete ? prev.stats.correctChars + 1 : prev.stats.correctChars,
					incorrectChars: prev.stats.incorrectChars,
				};

				let newSentenceIndex = prev.currentSentenceIndex;
				let newCharIndex = currentCharIndex;
				let newUserInput = prev.userInput;

				if (isCharComplete) {
					newCharIndex += 1;
					newUserInput = prev.userInput + expectedChar;

					if (newCharIndex >= currentSentence.length) {
						// 文章完成時の処理は上で行っているのでここでは何もしない
						// 次の文章への移行は上のスキップ処理で行われる
						newSentenceIndex = (newSentenceIndex + 1) % sentences.length;
						newCharIndex = 0;
						newUserInput = "";
					}
				}

				return {
					...prev,
					currentCharIndex: newCharIndex,
					stats: newStats,
					userInput: newUserInput,
				};
			});

			if (isCharComplete) {
				setCurrentInput("");
				setCurrentRomajiIndex(0);
				setRomajiProgress([]);
			} else {
				setCurrentInput(currentInput + char);
				setCurrentRomajiIndex(nextRomajiIndex);
			}
		},
		[
			gameState.isGameActive,
			gameState.currentSentenceIndex,
			gameState.currentCharIndex,
			currentInput,
			currentRomajiIndex,
			getNextValidCharIndex,
		],
	);

	const resetGame = useCallback(() => {
		setGameState({
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
		setCurrentInput("");
		setRomajiProgress([]);
		setCurrentRomajiIndex(0);
		setIncorrectChars(new Set());
	}, []);

	// タイマー
	useEffect(() => {
		if (!gameState.isGameActive || gameState.timeLeft <= 0) return;

		const timer = setInterval(() => {
			setGameState((prev) => {
				if (prev.timeLeft <= 1) {
					setTimeout(finishGame, 0); // 非同期でfinishGameを実行
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
		incorrectChars,
		isSkippableCharacter,
		finishGame,
		handleKeyPress,
		resetGame,
		currentSentence: sentences[gameState.currentSentenceIndex],
	};
};
