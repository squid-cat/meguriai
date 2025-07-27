import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import avatars from "./_avatars";
import dashboard from "./_dashboard";
import hello from "./_hello";
import user from "./_user";
import users from "./_users";
import workRecords from "./_work-records";

const app = new Hono().basePath("/api");

// CORS設定を追加
app.use(
	"*",
	cors({
		origin: [
			"http://localhost:3000",
			"https://meguriai-squid-pom.up.railway.app",
		],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
	}),
);

const route = app
	.route("/hello", hello)
	.route("/dashboard", dashboard)
	.route("/work-records", workRecords)
	.route("/users", users)
	.route("/avatars", avatars)
	.route("/user", user);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
