import { supabase } from "@/lib/supabase";
import { BlockfrostProvider } from "@meshsdk/core";

const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
const provider = new BlockfrostProvider(apiKey!);

export async function GET() {
	try {
		// Get all pending transactions
		const { data: transactions, error } = await supabase
			.from("transactions")
			.select("*")
			.eq("status", "pending")
			.order("created_at", { ascending: true })
			.limit(50);

		if (error) throw error;

		// Check each transaction status
		for (const tx of transactions || []) {
			try {
				const response = await fetch(
					`https://cardano-preview.blockfrost.io/api/v0/txs/${tx.tx_hash}`,
					{
						headers: {
							project_id: apiKey!,
						},
					},
				);

				if (response.ok) {
					// Transaction found and confirmed
					await supabase
						.from("transactions")
						.update({
							status: "confirmed",
							updated_at: new Date(),
						})
						.eq("tx_hash", tx.tx_hash);
				}
			} catch (err) {
				console.error(`Error checking transaction ${tx.tx_hash}:`, err);
			}
		}

		return Response.json({
			success: true,
			checked: transactions?.length || 0,
		});
	} catch (error) {
		console.error("Cron job error:", error);
		return Response.json({ error: "Cron job failed" }, { status: 500 });
	}
}
