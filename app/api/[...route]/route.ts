import { Hono } from "hono";
import { handle } from "hono/vercel";
import avatars from "./_avatars";
import dashboard from "./_dashboard";
import hello from "./_hello";
import user from "./_user";
import users from "./_users";
import workRecords from "./_work-records";

const app = new Hono().basePath("/api");

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
