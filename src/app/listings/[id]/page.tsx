"use client";

import { useState, useEffect } from "react";
import PropertyDetail from "@/components/PropertyDetail";
import { useParams } from "next/navigation";

export default function PropertyDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const [property, setProperty] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchProperty = async () => {
			console.log("[PropertyDetail] Initiating lookup for ID:", id);
			setLoading(true);

			try {
				// 1. Check mock data and localStorage first
				const mintedProperties = JSON.parse(
					localStorage.getItem("mintedProperties") || "[]",
				);
				const localProperties = [...mintedProperties];

				console.log(
					"[PropertyDetail] Local properties available:",
					localProperties.length,
				);
				let found = localProperties.find((p) => p.id.toString() === id);

				if (found) {
					console.log("[PropertyDetail] Property found in local cache:", found);
					setProperty(found);
					setLoading(false);
					return;
				}

				// 2. Fetch from decentralized API
				console.log(
					"[PropertyDetail] Property not in local cache. Fetching from API...",
				);
				const [listingsRes, rentedRes] = await Promise.all([
					fetch("/api/listings"),
					fetch("/api/rentals"),
				]);

				if (listingsRes.ok && rentedRes.ok) {
					const listings = await listingsRes.json();
					const rentedCIDs = await rentedRes.json();
					console.log(
						"[PropertyDetail] API returned",
						listings.length,
						"listings and",
						rentedCIDs.length,
						"rentals",
					);

					const merged = listings.map((p: any) => ({
						...p,
						status: rentedCIDs.includes(p.metadataIpfsHash || "")
							? "Rented"
							: "Available",
					}));

					found = merged.find((p: any) => p.id.toString() === id);

					if (found) {
						console.log(
							"[PropertyDetail] Property found in API results:",
							found,
						);
						setProperty(found);
					} else {
						console.warn(
							"[PropertyDetail] Property ID not found in API results either.",
						);
					}
				} else {
					console.error("[PropertyDetail] API Error:", {
						listingsStatus: listingsRes.status,
						rentalsStatus: rentedRes.status,
					});
				}
			} catch (error) {
				console.error("[PropertyDetail] Fatal error during fetch:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return <PropertyDetail property={property} />;
}
