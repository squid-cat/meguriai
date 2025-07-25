import { hc } from "hono/client";
import { AppType } from "../app/api/[...route]";

export const client = hc<AppType>("http://localhost:3000/").api;

