import cron from "node-cron";
import { supabase } from "./supabase";

const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;

// Determine base URL from API key
const getBaseUrl = () => {
	if (apiKey?.startsWith("mainnet"))
		return "https://cardano-mainnet.blockfrost.io/api/v0";
	if (apiKey?.startsWith("preprod"))
		return "https://cardano-preprod.blockfrost.io/api/v0";
	if (apiKey?.startsWith("preview"))
		return "https://cardano-preview.blockfrost.io/api/v0";
	return "https://cardano-preview.blockfrost.io/api/v0";
};

const BASE_URL = getBaseUrl();

export function startTransactionCheckCron() {
	cron.schedule("*/20 * * * * *", async () => {
		console.log("[Cron] Syncing transaction states...");

		try {
			const { data: transactions, error } = await supabase
				.from("transactions")
				.select("*")
				.eq("status", "pending")
				.order("created_at", { ascending: true })
				.limit(50);

			if (error) throw error;

			for (const tx of transactions || []) {
				try {
					const response = await fetch(`${BASE_URL}/txs/${tx.tx_hash}`, {
						headers: {
							project_id: apiKey!,
						},
					});

					if (response.ok) {
						// Transaction is on-chain (Successful)
						const { error: updateError } = await supabase
							.from("transactions")
							.update({
								status: "confirmed",
								updated_at: new Date().toISOString(),
							})
							.eq("tx_hash", tx.tx_hash);

						if (updateError) {
							console.error(
								`[Cron] Failed to update DB for ${tx.tx_hash}:`,
								updateError.message,
							);
						} else {
							console.log(`[Cron] Transaction ${tx.tx_hash} confirmed in DB`);
						}
					} else if (response.status === 404) {
						// Check if it's been pending for more than 15 minutes (Expired/Failed)
						const createdAt = new Date(tx.created_at);
						const now = new Date();
						const diffMinutes =
							(now.getTime() - createdAt.getTime()) / (1000 * 60);

						console.log(
							`[Cron] ${tx.tx_hash} still 404. Age: ${Math.round(diffMinutes)}m`,
						);

						if (diffMinutes > 15) {
							const { error: failError } = await supabase
								.from("transactions")
								.update({
									status: "failed",
									updated_at: new Date().toISOString(),
								})
								.eq("tx_hash", tx.tx_hash);

							if (failError) {
								console.error(
									`[Cron] Failed to mark ${tx.tx_hash} as failed:`,
									failError.message,
								);
							} else {
								console.log(
									`[Cron] Transaction ${tx.tx_hash} marked as failed (Expired)`,
								);
							}
						}
					} else {
						console.warn(
							`[Cron] Blockfrost returned ${response.status} for ${tx.tx_hash}`,
						);
					}
				} catch (err) {
					console.error(
						`[Cron] Error checking transaction ${tx.tx_hash}:`,
						err,
					);
				}
			}
		} catch (error) {
			console.error("[Cron] Job error:", error);
		}
	});

	console.log(`Transaction check cron started using ${BASE_URL}`);
}
