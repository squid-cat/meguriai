import { Hono } from "hono";
import { handle } from "hono/vercel";
import hello from "./_hello";
import test from "./_test";

const app = new Hono().basePath("/api");

const route = app.route("/hello", hello).route("/test", test);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
