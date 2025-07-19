import { orpc } from "@/lib/orpc";
import { safe } from "@orpc/client";
import { headers } from "next/headers";
import Image from "next/image";
import SettingsDialog from "./SettingsDialog";

export default async function SettingsDialogWrapper() {
	const { data: settings, error } = await safe(
		orpc.users.getSettingsByUserId(
			{},
			{
				context: {
					cache: "no-store",
					headers: await headers(),
				},
			},
		),
	);

	if (error) throw error;

	return (
		<div className="absolute top-[100px] right-[100px]">
			<SettingsDialog prompt={settings.prompt} />
			<div className="absolute top-10 right-10 w-full">
				<Image src="/arrow.png" width={100} height={50} alt="" />
			</div>
		</div>
	);
}
