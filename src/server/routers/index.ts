import { pub } from "../orpc";
import { userRouter } from "./users";

export const router = {
	users: pub.prefix("/users").router(userRouter),
};
