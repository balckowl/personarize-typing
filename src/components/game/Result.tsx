import type { TypingStats } from "@/types";
import { AlertTriangle, Clock, Home, RotateCw, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface ResultProps {
	stats: TypingStats;
	onRestart: () => void;
}

export const Result: React.FC<ResultProps> = ({ stats, onRestart }) => {
	const getWPMRating = (wpm: number) => {
		if (wpm >= 60)
			return { rating: "エクセレント", color: "text-yellow-500", bgColor: "bg-yellow-50" };
		if (wpm >= 40) return { rating: "グッド", color: "text-green-500", bgColor: "bg-green-50" };
		if (wpm >= 20) return { rating: "まずまず", color: "text-blue-500", bgColor: "bg-blue-50" };
		return { rating: "練習あるのみ", color: "text-gray-500", bgColor: "bg-gray-50" };
	};

	const getAccuracyRating = (accuracy: number) => {
		if (accuracy >= 95) return { rating: "完璧", color: "text-yellow-500" };
		if (accuracy >= 85) return { rating: "優秀", color: "text-green-500" };
		if (accuracy >= 70) return { rating: "良好", color: "text-blue-500" };
		return { rating: "要改善", color: "text-red-500" };
	};

	const wpmRating = getWPMRating(stats.wpm);
	const accuracyRating = getAccuracyRating(stats.accuracy);

	const topMistakes = Object.entries(stats.mistakeKeys)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5);

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="text-center">
				<h1 className="mb-2 font-bold text-3xl text-gray-900">ゲーム終了</h1>
				<p className="text-gray-600">お疲れさまでした。結果をご確認ください。</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className={`${wpmRating.bgColor} rounded-xl border p-6`}>
					<div className="mb-4 flex items-center">
						<Clock className={`h-6 w-6 ${wpmRating.color} mr-3`} />
						<h3 className="font-semibold text-gray-900 text-lg">タイピング速度</h3>
					</div>
					<div className="mb-2 font-bold text-4xl text-gray-900">{stats.wpm} WPM</div>
					<div className={`font-medium text-sm ${wpmRating.color}`}>{wpmRating.rating}</div>
					<p className="mt-2 text-gray-500 text-xs">Words Per Minute（1分間あたりの入力単語数）</p>
				</div>

				<div className="rounded-xl border bg-green-50 p-6">
					<div className="mb-4 flex items-center">
						<Target className={`h-6 w-6 ${accuracyRating.color} mr-3`} />
						<h3 className="font-semibold text-gray-900 text-lg">正確度</h3>
					</div>
					<div className="mb-2 font-bold text-4xl text-gray-900">{stats.accuracy}%</div>
					<div className={`font-medium text-sm ${accuracyRating.color}`}>
						{accuracyRating.rating}
					</div>
					<p className="mt-2 text-gray-500 text-xs">正しく入力できた文字の割合</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-blue-600">{stats.totalChars}</div>
					<div className="text-gray-500 text-sm">総入力文字数</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-green-600">{stats.correctChars}</div>
					<div className="text-gray-500 text-sm">正解文字数</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-red-600">{stats.incorrectChars}</div>
					<div className="text-gray-500 text-sm">ミス文字数</div>
				</div>
				<div className="rounded-lg border bg-white p-4 text-center">
					<div className="font-bold text-2xl text-purple-600">
						{Math.round((stats.correctChars / 90) * 60)}
					</div>
					<div className="text-gray-500 text-sm">平均CPM</div>
				</div>
			</div>

			{topMistakes.length > 0 && (
				<div className="rounded-xl border bg-red-50 p-6">
					<div className="mb-4 flex items-center">
						<AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
						<h3 className="font-semibold text-gray-900 text-lg">よく間違えるキー</h3>
					</div>
					<div className="grid grid-cols-2 gap-3 md:grid-cols-5">
						{topMistakes.map(([key, count]) => (
							<div key={key} className="rounded-lg border bg-white p-3 text-center">
								<div className="font-bold font-mono text-red-600 text-xl">
									{key === " " ? "スペース" : key}
								</div>
								<div className="text-gray-500 text-sm">{count}回ミス</div>
							</div>
						))}
					</div>
					<p className="mt-4 text-gray-600 text-sm">
						これらのキーを重点的に練習することで、タイピング精度が向上します。
					</p>
				</div>
			)}

			<div className="flex justify-center space-x-4">
				<Button
					type="button"
					onClick={onRestart}
					className="cursor-pointer rounded-lg px-8 py-3 font-semibold"
				>
					<RotateCw /> もう一度プレイ
				</Button>
				<Button
					variant="outline"
					asChild
					type="button"
					className="cursor-pointer rounded-lg px-8 py-3 font-semibold"
				>
					<Link href="/">
						<Home /> ホームに戻る
					</Link>
				</Button>
			</div>
		</div>
	);
};
