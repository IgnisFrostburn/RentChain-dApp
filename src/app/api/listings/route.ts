import { NextResponse } from "next/server";

export async function GET() {
	try {
		const projectId = process.env.BLOCKFROST_IPFS_PROJECT_ID;
		if (!projectId) {
			return NextResponse.json(
				{ error: "Blockfrost IPFS Project ID not configured" },
				{ status: 500 },
			);
		}

		// 1. Get list of all pinned objects
		const pinListResponse = await fetch(
			"https://ipfs.blockfrost.io/api/v0/ipfs/pin/list?count=100&order=desc",
			{
				headers: { project_id: projectId },
			},
		);

		if (!pinListResponse.ok) {
			throw new Error("Failed to fetch pin list from Blockfrost");
		}

		const pins = await pinListResponse.json();

		// 2. Fetch and parse JSON for each pinned object
		// We filter for objects that look like our RentalMetadata
		const properties = await Promise.all(
			pins.map(async (pin: any) => {
				try {
					const catResponse = await fetch(
						`https://ipfs.blockfrost.io/api/v0/ipfs/gateway/${pin.ipfs_hash}`,
						{
							headers: { project_id: projectId },
							// Set a timeout or signal if needed, but for now we'll just fetch
						},
					);

					if (!catResponse.ok) return null;

					const contentType = catResponse.headers.get("content-type");
					if (!contentType || !contentType.includes("application/json"))
						return null;

					const metadata = await catResponse.json();

					// Simple validation: must have name and landlordAddress to be a property listing
					if (
						metadata.name &&
						metadata.landlordAddress &&
						metadata.coordinates
					) {
						return {
							...metadata,
							id: pin.ipfs_hash, // Use the CID as the unique ID
							title: metadata.name,
							location: metadata.address,
							lat: metadata.coordinates.latitude,
							lng: metadata.coordinates.longitude,
							imageIpfsHash: metadata.image?.replace("ipfs://", ""),
							metadataIpfsHash: pin.ipfs_hash,
						};
					}
					return null;
				} catch (e) {
					return null;
				}
			}),
		);

		// Filter out nulls (failed fetches or non-listing JSONs)
		const validListings = properties.filter((p) => p !== null);

		return NextResponse.json(validListings);
	} catch (error) {
		console.error("Listings API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
