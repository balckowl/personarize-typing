import { getSettingsByUserId } from "./getSettingsByUserId";
import { getTweetsByUserId } from "./getTweetsByUserId";
import { updateSettingsByUserId } from "./updateSettingsByUserId";

export const userRouter = {
	getTweetsByUserId,
	getSettingsByUserId,
	updateSettingsByUserId,
};
