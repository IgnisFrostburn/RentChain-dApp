import { supabase } from "@/lib/supabase";

export class TransactionTrackingService {
	static async checkInitialStatus(txHash: string) {
		const { data, error } = await supabase
			.from("transactions")
			.select("status")
			.eq("tx_hash", txHash)
			.single();

		if (error) {
			console.warn(
				"[TransactionTrackingService] Could not verify status with DB",
				error.message,
			);
			return null;
		}
		return data?.status;
	}

	static subscribeToStatus(txHash: string, onUpdate: (status: string) => void) {
		const channel = supabase
			.channel(`tx-status-${txHash}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "transactions",
					filter: `tx_hash=eq.${txHash}`,
				},
				(payload) => {
					onUpdate(payload.new.status);
				},
			)
			.subscribe();

		return channel;
	}

	static unsubscribe(channel: any) {
		supabase.removeChannel(channel);
	}
}
