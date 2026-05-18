import { NextResponse } from "next/server";


export async function GET() {
	try {
		const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
		if (!projectId) {
			return NextResponse.json(
				{ error: "Blockfrost Cardano Project ID not configured" },
				{ status: 500 },
			);
		}

		// We use metadata label 1618 for rental confirmations
		const label = "1618";

		// 1. Fetch all transactions under the rental metadata label
		// Note: For a production app with many transactions, we would need to handle pagination properly
		const metadataResponse = await fetch(
			`https://cardano-preview.blockfrost.io/api/v0/metadata/txs/labels/${label}?count=100&order=desc`,
			{
				headers: { project_id: projectId },
			},
		);

		if (!metadataResponse.ok) {
			// If the label doesn't exist yet (no transactions), return an empty list
			if (metadataResponse.status === 404) {
				return NextResponse.json([]);
			}
			throw new Error("Failed to fetch metadata from Blockfrost");
		}

		const txs = await metadataResponse.json();

		// 2. Extract the CIDs of properties that have been rented
		// We expect metadata format: { "1618": { "cid": "..." } }
		const rentedCIDs = txs
			.map((tx: any) => {
				const metadata = tx.json_metadata;
				return metadata?.cid || null;
			})
			.filter((cid: string | null) => cid !== null);

		// Remove duplicates (one property could theoretically have multiple txs if not guarded, but we'll return unique ones)
		const uniqueRentedCIDs = Array.from(new Set(rentedCIDs));

		return NextResponse.json(uniqueRentedCIDs);
	} catch (error) {
		console.error("Rentals API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
