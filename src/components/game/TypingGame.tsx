import { twitterUsers } from "@/data/sentence";
import { useTypingGame } from "@/hooks/useTypingGame";
import { getExpectedRomaji, isHiragana, isKatakana } from "@/lib/romaji";
import { useEffect } from "react";
import { TwitterPost } from "./TwitterPost";

export const TypingGame: React.FC = () => {
	const {
		gameState,
		currentInput,
		romajiProgress,
		currentRomajiIndex,
		startGame,
		handleKeyPress,
		currentSentence,
		incorrectChars,
		isSkippableCharacter,
	} = useTypingGame();

	useEffect(() => {
		if (!gameState.isGameActive && !gameState.isGameFinished) {
			startGame();
		}
	}, [gameState.isGameActive, gameState.isGameFinished, startGame]);

	useEffect(() => {
		if (!gameState.isGameActive) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.length === 1) {
				e.preventDefault();
				handleKeyPress(e.key);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameState.isGameActive, handleKeyPress]);

	const renderRomajiWithProgress = (char: string, charIndex: number) => {
		const expectedRomaji = getExpectedRomaji(char);
		const displayRomaji = expectedRomaji[0] || char;
		const isCurrentChar = charIndex === gameState.currentCharIndex;

		return displayRomaji.split("").map((romajiChar, romajiIndex) => {
			let className = "inline-block text-xs leading-tight mx-px";

			if (charIndex < gameState.currentCharIndex) {
				// 完了した文字のローマ字は緑
				className += " text-green-600 font-medium";
			} else if (isCurrentChar) {
				// 現在の文字のローマ字
				if (romajiIndex < currentRomajiIndex) {
					// 入力済みのローマ字文字
					const progressItem = romajiProgress[romajiIndex];
					if (progressItem?.isCorrect) {
						className += " text-green-600 font-medium bg-green-100 rounded px-0.5";
					} else {
						className += " text-red-600 font-medium bg-red-100 rounded px-0.5";
					}
				} else if (romajiIndex === currentRomajiIndex) {
					// 現在入力中のローマ字文字
					className += " text-blue-600 font-bold bg-blue-200 rounded px-0.5";
				} else {
					// 未入力のローマ字文字
					className += " text-gray-500";
				}
			} else {
				// 未到達の文字のローマ字
				className += " text-gray-400";
			}

			return (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<span key={romajiIndex} className={className}>
					{romajiChar}
				</span>
			);
		});
	};

	const renderText = () => {
		return currentSentence.split("").map((char, index) => {
			let textClassName = "text-xl font-medium";

			// スキップ可能な文字は薄いグレーで表示
			if (isSkippableCharacter(char)) {
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<span key={index} className="mx-px font-medium text-gray-300 text-xl">
						{char}
					</span>
				);
			}

			if (index < gameState.currentCharIndex) {
				// 完了した文字
				textClassName += " text-green-600 bg-green-100";
			} else if (index === gameState.currentCharIndex) {
				// 現在入力中の文字
				textClassName += " bg-blue-200 text-blue-800";
			} else if (incorrectChars.has(index)) {
				// 間違えた文字
				textClassName += " bg-red-200 text-red-800";
			} else {
				// 未入力の文字
				textClassName += " text-gray-700";
			}

			return (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<span key={index} className="relative mx-px mb-6 inline-block">
					{/* biome-ignore lint/style/useTemplate: <explanation> */}
					<span className={textClassName + " rounded px-1 py-0.5"}>{char}</span>
					{(isHiragana(char) || isKatakana(char)) && (
						<span className="mt-1 block h-4 text-center">
							{renderRomajiWithProgress(char, index)}
						</span>
					)}
				</span>
			);
		});
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const user = twitterUsers[gameState.currentSentenceIndex % twitterUsers.length];

	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-6 text-center">
				<div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-800">
					残り時間: {formatTime(gameState.timeLeft)}
				</div>
			</div>

			<TwitterPost user={user}>
				<div className="leading-relaxed">
					<div className="text-left font-mono" style={{ lineHeight: "3.5" }}>
						{renderText()}
					</div>
					{currentInput && (
						<div className="mt-4 rounded bg-blue-50 p-2 text-sm">
							<span className="text-gray-600">入力中: </span>
							<span className="font-mono text-blue-600">{currentInput}</span>
						</div>
					)}
				</div>
			</TwitterPost>

			<div className="mt-6 rounded-lg bg-gray-50 p-4">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<div className="font-bold text-2xl text-blue-600">{gameState.stats.wpm}</div>
						<div className="text-gray-500 text-sm">WPM</div>
					</div>
					<div>
						<div className="font-bold text-2xl text-green-600">{gameState.stats.correctChars}</div>
						<div className="text-gray-500 text-sm">正解文字数</div>
					</div>
					<div>
						<div className="font-bold text-2xl text-red-600">{gameState.stats.incorrectChars}</div>
						<div className="text-gray-500 text-sm">ミス数</div>
					</div>
				</div>
			</div>

			<div className="mt-4 text-center text-gray-600">
				<p>キーボードで入力してください</p>
			</div>
		</div>
	);
};
