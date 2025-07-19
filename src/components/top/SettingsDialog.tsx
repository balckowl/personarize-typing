"use client";

import { orpc } from "@/lib/orpc";
import { SettingsOutputSchema, type SettingsOutputSchemaType } from "@/server/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError, safe } from "@orpc/client";
import { Loader2, Settings, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

type Props = {
	prompt: SettingsOutputSchemaType["prompt"];
};

export default function SettingsDialog({ prompt }: Props) {
	// ダイアログの開閉状態を管理
	const [open, setOpen] = useState(false);

	const form = useForm<SettingsOutputSchemaType>({
		resolver: zodResolver(SettingsOutputSchema),
		defaultValues: { prompt },
	});

	const onSubmit = async (values: SettingsOutputSchemaType) => {
		const { error, data } = await safe(
			orpc.users.updateSettingsByUserId({ prompt: values.prompt }),
		);

		if (isDefinedError(error)) {
			if (error.code === "UNAUTHORIZED") {
				toast.error(error.message);
			}
		} else if (error) {
			toast.error("エラーが発生しました。");
		} else {
			toast.success(data.message);
			// 成功時にダイアログを閉じる
			setOpen(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{/* トリガーで open を true に */}
			<DialogTrigger asChild>
				<Button onClick={() => setOpen(true)} className="flex cursor-pointer items-center">
					<Settings className="mr-1 h-5 w-5" />
					設定
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>設定</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="prompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-md">
										<WandSparkles className="h-5 w-5" />
										カスタムプロンプト
									</FormLabel>
									<FormControl>
										<Textarea
											disabled={form.formState.isSubmitting}
											placeholder="語尾を「にゃん」にして"
											className="h-[200px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>あなたのツイートをカスタマイズできます。</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={form.formState.isSubmitting}
							className="w-full cursor-pointer"
							type="submit"
						>
							{form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
							保存
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
