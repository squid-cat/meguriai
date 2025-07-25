import { createClient } from "../utils/api-client";

export const dynamic = "force-dynamic";

export default async function Home() {
	const client = await createClient();
	const res = await (await client.hello.$get()).json();

	return <h1>{res.message}</h1>;
}
