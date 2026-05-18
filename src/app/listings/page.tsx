"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Search, SlidersHorizontal, Terminal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Property } from "@/types/property";

export default function ListingsPage() {
	const [allProperties, setAllProperties] = useState<Property[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDecentralizedData = async () => {
			try {
				// 1. Fetch all pinned properties from IPFS
				const listingsRes = await fetch("/api/listings");
				const rentedRes = await fetch("/api/rentals");

				if (listingsRes.ok && rentedRes.ok) {
					const listings: Property[] = await listingsRes.json();
					const rentedCIDs: string[] = await rentedRes.json();

					// 2. Map on-chain status
					const merged = listings.map((p) => ({
						...p,
						status: rentedCIDs.includes(p.metadataIpfsHash || "")
							? "Rented"
							: "Available",
					}));

					// 3. Add mock properties for demo variety
					setAllProperties([...merged] as Property[]);
				}
			} catch (error) {
				console.error("Error fetching decentralized listings:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDecentralizedData();
	}, []);

	return (
		<div className="min-h-screen bg-[#030303] text-white crypto-grid">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Protocol Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-blue-500 font-black tracking-widest text-[10px] uppercase">
							<Terminal className="w-4 h-4" />
							Protocol / Assets / Listings
						</div>
						<h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.8]">
							ACTIVE <br />
							<span className="text-gradient">INVENTORY.</span>
						</h1>
						<p className="text-gray-500 font-bold text-lg max-w-md leading-snug">
							Verifiable real-estate assets secured on the Cardano blockchain.
						</p>
					</div>

					<div className="w-full md:w-auto flex items-center gap-4">
						<div className="relative flex-1 md:w-96">
							<div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-2xl" />
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
							<Input
								placeholder="Query location..."
								className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-700"
							/>
						</div>
						<Button
							variant="outline"
							size="icon"
							className="h-14 w-14 rounded-2xl border-white/5 bg-white/[0.03] hover:bg-white/10 transition-all">
							<SlidersHorizontal className="w-5 h-5 text-gray-400" />
						</Button>
					</div>
				</div>

				{/* Grid */}
				{isLoading ? (
					<div className="text-center py-32 space-y-6">
						<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
						<p className="text-gray-500 font-black uppercase tracking-widest text-xs">
							Accessing IPFS Inventory...
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{allProperties.map((property, index) => (
							<div
								key={property.id}
								className="animate-in fade-in slide-in-from-bottom-8 duration-700"
								style={{ animationDelay: `${index * 150}ms` }}>
								<PropertyCard
									id={property.id}
									title={property.title}
									location={property.location}
									rentADA={property.rentADA}
									depositADA={property.depositADA}
									status={property.status}
									imageIpfsHash={property.imageIpfsHash}
									landlordAddress={property.landlordAddress}
								/>
							</div>
						))}
					</div>
				)}

				{/* Protocol Load More */}
				<div className="mt-24 flex flex-col items-center gap-4">
					<div className="w-1 h-20 bg-gradient-to-b from-blue-600 to-transparent" />
					<Button
						variant="ghost"
						className="text-gray-500 font-black uppercase tracking-widest text-xs hover:text-white hover:bg-transparent">
						End of Protocol Stream
					</Button>
				</div>
			</main>
		</div>
	);
}
