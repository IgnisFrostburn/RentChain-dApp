"use client";

import Navbar from "@/components/Navbar";
import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { useWallet } from "@/contexts/WalletContext";
import {
	MapPin,
	Coins,
	Info,
	ArrowRight,
	Activity,
	Terminal,
	Wallet2,
	Upload,
	X,
	CheckCircle2,
} from "lucide-react";
import { Property, PropertyMetadata } from "@/types/property";
import Image from "next/image";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), {
	ssr: false,
	loading: () => (
		<div className="h-[300px] w-full bg-white/5 rounded-2xl animate-pulse flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">
			Loading Geospatial Engine...
		</div>
	),
});

export default function ListPropertyPage() {
	const router = useRouter();
	const { connectedWalletName, walletAddress, setShowWalletModal } =
		useWallet();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Form state
	const [title, setTitle] = useState("");
	const [locationAddress, setLocationAddress] = useState("");
	const [propertyType] = useState("Residential");
	const [leaseTerm] = useState("12 Months");

	// Image state
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Map state
	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!connectedWalletName) {
			setShowWalletModal(true);
			return;
		}

		if (!imageFile) {
			alert("Please upload a property image.");
			return;
		}

		if (!coordinates) {
			alert("Please select a location on the map.");
			return;
		}

		// Extract form values synchronously before any async operations
		const rentADA = parseInt(
			(e.currentTarget.elements.namedItem("rent") as HTMLInputElement).value,
		);
		const depositADA = parseInt(
			(e.currentTarget.elements.namedItem("deposit") as HTMLInputElement).value,
		);
		const description = (
			e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement
		).value;

		setIsSubmitting(true);

		try {
			// 1. Upload image to IPFS via our secure API route
			const ipfsFormData = new FormData();
			ipfsFormData.append("file", imageFile);

			const ipfsResponse = await fetch("/api/ipfs", {
				method: "POST",
				body: ipfsFormData,
			});

			if (!ipfsResponse.ok) {
				throw new Error("Failed to upload image to IPFS");
			}

			const { ipfsHash } = await ipfsResponse.json();

			// 2. Prepare property data using standard interface
			const landlordAddress =
				walletAddress ||
				"addr_test1vph779m96nxjd3s28t8eeqkt4e2x4gsfkrmszpty4qylxsggdze6w";

			const newProperty: Property = {
				id: Date.now(),
				title,
				location:
					locationAddress ||
					`${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
				lat: coordinates.lat,
				lng: coordinates.lng,
				rentADA,
				depositADA,
				description,
				imageIpfsHash: ipfsHash,
				status: "Available",
				landlordAddress,
				propertyType,
				leaseTerm,
			};

			// 3. Create fully decentralized metadata using Clean Logic class
			const rentalMetadata = PropertyMetadata.fromProperty(newProperty);
			const metadataFile = PropertyMetadata.toFile(rentalMetadata);

			const metadataFormData = new FormData();
			metadataFormData.append("file", metadataFile);

			const metadataResponse = await fetch("/api/ipfs", {
				method: "POST",
				body: metadataFormData,
			});

			if (!metadataResponse.ok) {
				throw new Error("Failed to upload metadata to IPFS");
			}

			const { ipfsHash: metadataHash } = await metadataResponse.json();
			newProperty.metadataIpfsHash = metadataHash;

			// 4. Save to localStorage
			const mintedProperties = JSON.parse(
				localStorage.getItem("mintedProperties") || "[]",
			);
			mintedProperties.push(newProperty);
			localStorage.setItem(
				"mintedProperties",
				JSON.stringify(mintedProperties),
			);

			alert("Property successfully initialized on the protocol!");
			router.push("/listings");
		} catch (error) {
			console.error("Error minting property:", error);
			alert("Error initializing property. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#030303] text-white crypto-grid">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
				<div className="flex flex-col lg:flex-row gap-24 items-start">
					{/* Protocol Info */}
					<div className="flex-1 space-y-12">
						<div className="space-y-6">
							<div className="flex items-center gap-2 text-blue-500 font-black tracking-widest text-[10px] uppercase">
								<Terminal className="w-4 h-4" />
								Protocol / Asset_Onboarding
							</div>
							<h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
								MINT YOUR <br />
								<span className="text-gradient">INVENTORY.</span>
							</h1>
							<p className="text-xl text-gray-500 font-bold max-w-xl leading-snug">
								Transform physical property into a verifiable on-chain rental
								asset. Join the decentralized economy.
							</p>
						</div>

						<div className="grid gap-8">
							{[
								{
									icon: Activity,
									title: "On-Chain Verification",
									desc: "Every listing is hashed and anchored to the Cardano ledger for permanent validity.",
								},
								{
									icon: Coins,
									title: "Liquidity Streams",
									desc: "Receive automated rental payments in ADA, settled instantly to your treasury address.",
								},
								{
									icon: Info,
									title: "Smart Escrow",
									desc: "Security deposits are managed by the protocol, eliminating trust requirements.",
								},
							].map((item, i) => (
								<div
									key={i}
									className="flex gap-6 group">
									<div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
										<item.icon className="w-7 h-7" />
									</div>
									<div className="space-y-1">
										<h4 className="text-xl font-black text-white uppercase tracking-tighter">
											{item.title}
										</h4>
										<p className="text-gray-500 font-medium text-sm leading-relaxed">
											{item.desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Onboarding Form */}
					<div className="flex-1 w-full">
						<div className="relative">
							<div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
							<Card className="relative rounded-[3rem] border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
								<CardHeader className="p-12 pb-0">
									<CardTitle className="text-3xl font-black uppercase tracking-tighter">
										Asset Metadata
									</CardTitle>
									<CardDescription className="text-gray-500 font-bold">
										Input the technical parameters for the new asset node.
									</CardDescription>
								</CardHeader>
								<CardContent className="p-12 space-y-10">
									<form
										onSubmit={handleSubmit}
										className="space-y-8">
										<div className="space-y-3">
											<Label
												htmlFor="title"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
												Protocol Title
											</Label>
											<Input
												id="title"
												name="title"
												required
												value={title}
												onChange={(e) => setTitle(e.target.value)}
												placeholder="PH_CEBU_STUDIO_01 or Property Name"
												className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
											/>
										</div>

										<div className="space-y-3">
											<Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
												Asset Visuals (IPFS)
											</Label>
											{!imagePreview ? (
												<div
													onClick={() => fileInputRef.current?.click()}
													className="h-40 w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
													<div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors">
														<Upload className="w-6 h-6" />
													</div>
													<p className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-gray-400">
														Upload_Metadata_Image
													</p>
													<input
														type="file"
														ref={fileInputRef}
														onChange={handleImageChange}
														className="hidden"
														accept="image/*"
													/>
												</div>
											) : (
												<div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/10">
													<Image
														src={imagePreview}
														alt="Preview"
														className="w-full h-full object-cover"
													/>
													<button
														onClick={removeImage}
														className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors">
														<X className="w-5 h-5" />
													</button>
													<div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-md flex items-center gap-2">
														<CheckCircle2 className="w-4 h-4 text-emerald-500" />
														<span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
															Image_Ready
														</span>
													</div>
												</div>
											)}
										</div>

										<div className="space-y-3">
											<Label
												htmlFor="location"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
												Geospatial Data (Leaflet)
											</Label>
											<div className="h-[300px] w-full rounded-2xl border border-white/10">
												<Map
													location={
														coordinates
															? [coordinates.lat, coordinates.lng]
															: undefined
													}
													onLocationChange={(lat, lng) => {
														if (lat === null || lng === null)
															setCoordinates(null);
														else setCoordinates({ lat, lng });
													}}
													onAddressChange={(addr) => setLocationAddress(addr)}
												/>
											</div>
											{coordinates && (
												<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
													<MapPin className="w-4 h-4 text-blue-500" />
													<span className="text-[10px] font-mono text-blue-400">
														LAT: {coordinates.lat.toFixed(6)} | LNG:{" "}
														{coordinates.lng.toFixed(6)}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-3">
											<Label
												htmlFor="locationAddress"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
												Physical Address / Location
											</Label>
											<Input
												id="locationAddress"
												name="locationAddress"
												required
												value={locationAddress}
												onChange={(e) => setLocationAddress(e.target.value)}
												placeholder="Auto-filled from map or enter manually"
												className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
											/>
										</div>

										<div className="grid grid-cols-2 gap-6">
											<div className="space-y-3">
												<Label
													htmlFor="rent"
													className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
													Rent_ADA
												</Label>
												<Input
													id="rent"
													name="rent"
													type="number"
													required
													placeholder="0.00"
													className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-black focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
												/>
											</div>
											<div className="space-y-3">
												<Label
													htmlFor="deposit"
													className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
													Bond_ADA
												</Label>
												<Input
													id="deposit"
													name="deposit"
													type="number"
													required
													placeholder="0.00"
													className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-black focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
												/>
											</div>
										</div>

										<div className="space-y-3">
											<Label
												htmlFor="description"
												className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
												Node Description
											</Label>
											<Textarea
												id="description"
												name="description"
												required
												placeholder="Define asset amenities and parameters..."
												rows={4}
												className="rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
											/>
										</div>

										<Button
											type="submit"
											disabled={isSubmitting}
											className="w-full h-20 rounded-[2rem] bg-white text-black text-xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 group disabled:opacity-50">
											{!connectedWalletName ? (
												<span className="flex items-center gap-3 uppercase">
													<Wallet2 className="w-6 h-6" />
													Initialize Wallet
												</span>
											) : isSubmitting ? (
												<span className="flex items-center gap-3">
													<div className="w-5 h-5 border-2 border-gray-500 border-t-black rounded-full animate-spin" />
													INITIALIZING...
												</span>
											) : (
												<span className="flex items-center gap-3">
													Initialize Asset Node
													<ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
												</span>
											)}
										</Button>
									</form>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
