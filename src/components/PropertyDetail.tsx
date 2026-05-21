import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { useWallet } from "@/contexts/WalletContext";
import { useTransactionTracker } from "@/hooks/useTransactionTracker";
import { useRentProperty } from "@/hooks/useRentProperty";
import {
	ChevronLeft,
	MapPin,
	Wallet2,
	Clock,
	CheckCircle2,
	AlertCircle,
	ArrowRight,
	Terminal,
	Cpu,
	Fingerprint,
	Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";
import { getIpfsUrl } from "@/utils/ipfs";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("@/components/Map"), {
	ssr: false,
	loading: () => (
		<div className="h-[400px] w-full bg-white/5 rounded-[3rem] animate-pulse flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">
			Loading Geospatial Engine...
		</div>
	),
});

export default function PropertyDetail({ property }: { property: Property }) {
	const { wallet, connectedWalletName, walletAddress, setShowWalletModal } =
		useWallet();
	const {
		isSubmitted,
		setIsSubmitted,
		txStatus,
		setTxStatus,
		isConfirmed,
		isRentedByOthers,
		txHash,
		setTxHash,
	} = useTransactionTracker(property, walletAddress);

	const { isPending, handlePayment } = useRentProperty({
		property,
		wallet,
		walletAddress,
		isRentedByOthers,
		setTxHash,
		setIsSubmitted,
		setTxStatus,
	});

	const isLandlord = !!(
		walletAddress &&
		property?.landlordAddress &&
		walletAddress.toLowerCase() === property?.landlordAddress?.toLowerCase()
	);

	if (!property) {
		console.error(
			"[PropertyDetail Component] No property data received. Rendering 'Asset Not Found' UI.",
		);
		return (
			<div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
				<div className="text-center space-y-4">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto opacity-50" />
					<h1 className="text-3xl font-black uppercase tracking-tighter">
						Asset Not Found
					</h1>
					<Link href="/listings">
						<Button className="bg-white text-black font-black px-8">
							Return to Terminal
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#030303] text-white crypto-grid pb-24">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<Link
					href="/listings"
					className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 mb-10 transition-colors group">
					<ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
					Back to Terminal
				</Link>

				<div className="grid lg:grid-cols-12 gap-16">
					{/* Main Content */}
					<div className="lg:col-span-8 space-y-16">
						<section>
							<div className="flex flex-wrap items-center gap-4 mb-8">
								<Badge className="bg-blue-600 font-black px-5 py-1 text-[10px] tracking-widest uppercase rounded-full">
									Asset_ID_{property.id}
								</Badge>
								<div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
									<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
									Verified on Cardano
								</div>
							</div>

							<h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.85]">
								{property.title.toUpperCase()}
							</h1>

							<div className="flex items-center text-2xl text-gray-500 font-bold tracking-tight">
								<MapPin className="w-6 h-6 mr-3 text-blue-500" />
								{property.location}
							</div>
						</section>

						{/* Interactive Visual Element */}
						<div className="aspect-[21/9] rounded-[3rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group shadow-2xl">
							{property.imageIpfsHash ? (
								<Image
									src={getIpfsUrl(property.imageIpfsHash)}
									alt={property.title}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-1000"
								/>
							) : (
								<>
									<div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-purple-900/20 group-hover:scale-105 transition-transform duration-1000" />
									<div className="absolute inset-0 crypto-grid opacity-20" />
								</>
							)}

							<div className="absolute top-10 left-10 space-y-4">
								<Boxes className="w-12 h-12 text-blue-500/50" />
								<div className="p-4 glass rounded-2xl border-white/5 space-y-1">
									<p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
										Lease Contract V2.1
									</p>
									<p className="text-white font-mono text-xs">
										HASH: 9a2f...
										{property.imageIpfsHash
											? property.imageIpfsHash.substring(0, 4)
											: "110e"}
									</p>
								</div>
								{property.metadataIpfsHash && (
									<a
										href={getIpfsUrl(property.metadataIpfsHash)}
										target="_blank"
										rel="noopener noreferrer"
										className="p-4 glass rounded-2xl border-white/5 space-y-1 block hover:bg-white/5 transition-colors">
										<p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
											Decentralized Metadata
										</p>
										<p className="text-white font-mono text-xs line-clamp-1">
											CID: {property.metadataIpfsHash}
										</p>
									</a>
								)}
							</div>
						</div>

						<section className="space-y-8">
							<div className="flex items-center justify-between">
								<h2 className="text-4xl font-black text-white tracking-tighter uppercase">
									Geospatial Context
								</h2>
								<div className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
									<MapPin className="w-3 h-3" />
									Live Asset Coordinates
								</div>
							</div>

							<div className="h-[400px] w-full rounded-[3rem] border border-white/5 shadow-2xl">
								<Map
									interactive={false}
									location={
										property.lat && property.lng
											? [property.lat, property.lng]
											: undefined
									}
									zoom={15}
								/>
							</div>
						</section>

						<section className="space-y-8">
							<h2 className="text-4xl font-black text-white tracking-tighter uppercase">
								Description
							</h2>
							<p className="text-2xl text-gray-400 leading-relaxed font-medium max-w-4xl">
								{property.description}
							</p>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
								{[
									{
										label: "Type",
										value: property.propertyType || "Residential",
										icon: Terminal,
									},
									{ label: "Network", value: "Cardano", icon: Cpu },
									{
										label: "Identity",
										value: "KYC Verified",
										icon: Fingerprint,
									},
									{
										label: "Term",
										value: property.leaseTerm || "6-12 Mo",
										icon: Clock,
									},
								].map((spec, i) => (
									<div
										key={i}
										className="space-y-2">
										<div className="flex items-center gap-2 text-gray-500">
											<spec.icon className="w-3 h-3" />
											<span className="text-[10px] font-black uppercase tracking-widest">
												{spec.label}
											</span>
										</div>
										<p className="text-lg font-black text-white">
											{spec.value}
										</p>
									</div>
								))}
							</div>
						</section>

						<div className="p-10 rounded-[3rem] bg-white text-black flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
							<div className="space-y-3">
								<h3 className="text-3xl font-black tracking-tighter leading-none">
									SECURE SMART LEASE.
								</h3>
								<p className="text-gray-600 font-bold leading-snug">
									Terms are cryptographically locked until deposit refund.
								</p>
							</div>
							<Button className="h-14 px-10 bg-black text-white hover:bg-gray-800 font-black rounded-2xl shrink-0">
								View Technical Docs
							</Button>
						</div>
					</div>

					{/* Transaction Sidebar */}
					<div className="lg:col-span-4">
						<div className="sticky top-24 space-y-8">
							<Card className="rounded-[3rem] border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
								<div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
									<p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-4">
										Initial Transaction
									</p>
									<div className="flex items-baseline gap-2">
										<span className="text-6xl font-black tracking-tighter">
											{property.rentADA + property.depositADA}
										</span>
										<span className="text-2xl font-bold opacity-70 tracking-tight">
											ADA
										</span>
									</div>
									<p className="text-[10px] font-black uppercase tracking-widest mt-4 bg-black/20 inline-block px-3 py-1 rounded-full border border-white/10">
										Rent + Security Deposit
									</p>
								</div>

								<CardContent className="p-10 space-y-10">
									<div className="space-y-6">
										<div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
											<span className="text-gray-500">Monthly Yield</span>
											<span className="text-white">{property.rentADA} ADA</span>
										</div>
										<div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
											<span className="text-gray-500">Escrow Bond</span>
											<span className="text-white">
												{property.depositADA} ADA
											</span>
										</div>
										<div className="h-px bg-white/5" />
										<div className="flex justify-between items-center">
											<span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
												Verification Rate
											</span>
											<span className="text-white font-mono text-sm">
												99.98%
											</span>
										</div>
									</div>

									{isConfirmed ? (
										<div className="space-y-6 animate-in zoom-in duration-500">
											<div className="p-8 bg-emerald-500 text-black rounded-[2rem] text-center font-black shadow-[0_0_30px_rgba(16,185,129,0.3)]">
												<CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
												<p className="text-2xl tracking-tighter mb-1 uppercase">
													LEASE_ACTIVATED
												</p>
												<p className="text-xs opacity-70 uppercase tracking-widest">
													Access Granted
												</p>
											</div>
											{txHash && (
												<div className="p-4 bg-white/5 rounded-2xl border border-white/5">
													<p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">
														Tx Hash
													</p>
													<p className="text-blue-400 font-mono text-[10px] break-all">
														{txHash}
													</p>
												</div>
											)}
											<Link
												href="/my-rentals"
												className="block">
												<Button className="w-full h-16 rounded-2xl bg-white text-black font-black text-lg hover:bg-gray-200 shadow-xl transition-all active:scale-95">
													Open Dashboard
												</Button>
											</Link>
										</div>
									) : isSubmitted ? (
										<div className="space-y-6 animate-in fade-in duration-500">
											<div
												className={cn(
													"p-8 rounded-[2rem] text-center font-black border transition-all duration-500",
													txStatus === "failed"
														? "bg-red-500/10 border-red-500/50 text-red-500"
														: "bg-blue-600/10 border-blue-500/30 text-blue-400",
												)}>
												{txStatus === "failed" ? (
													<AlertCircle className="w-12 h-12 mx-auto mb-4" />
												) : (
													<Clock className="w-12 h-12 mx-auto mb-4 animate-pulse" />
												)}
												<p className="text-2xl tracking-tighter mb-1 uppercase">
													{txStatus === "failed"
														? "SYNC_FAILED"
														: "SYNCING_LEDGER"}
												</p>
												<p className="text-[10px] opacity-70 uppercase tracking-widest">
													{txStatus === "failed"
														? "Transaction Timed Out"
														: "Background Cron Active"}
												</p>
											</div>

											{txHash && (
												<div className="p-4 bg-white/5 rounded-2xl border border-white/5">
													<p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">
														Active Tx Hash
													</p>
													<p className="text-blue-400 font-mono text-[10px] break-all">
														{txHash}
													</p>
												</div>
											)}

											<div className="flex flex-col gap-3">
												{txStatus === "failed" && (
													<Button
														onClick={() => {
															setIsSubmitted(false);
															setTxHash(null);
															setTxStatus("pending");
														}}
														className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200">
														Retry Execution
													</Button>
												)}
												<p className="text-[9px] text-gray-500 text-center uppercase font-black tracking-widest leading-relaxed">
													The protocol is indexing your signature.
													<br />
													You can safely close this page.
												</p>
											</div>
										</div>
									) : (
										<div className="space-y-6">
											{!connectedWalletName ? (
												<Button
													onClick={() => setShowWalletModal(true)}
													className="w-full h-20 rounded-[2rem] bg-white text-black text-xl font-black hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
													<Wallet2 className="mr-3 w-6 h-6" />
													Initialize Wallet
												</Button>
											) : (
												<div className="space-y-6">
													<div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
														<div className="flex items-center gap-4">
															<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black">
																{connectedWalletName[0].toUpperCase()}
															</div>
															<div>
																<p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
																	Authenticated
																</p>
																<p className="text-white font-bold">
																	{connectedWalletName.toUpperCase()}
																</p>
															</div>
														</div>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setShowWalletModal(true)}
															className="text-red-500 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest">
															Reset
														</Button>
													</div>

													<Button
														disabled={
															isPending || isRentedByOthers || isLandlord
														}
														onClick={handlePayment}
														className={cn(
															"w-full h-20 rounded-[2rem] text-xl font-black transition-all",
															isPending || isRentedByOthers || isLandlord
																? "bg-white/5 text-gray-500 cursor-not-allowed"
																: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_40px_rgba(37,99,235,0.3)]",
														)}>
														{isPending ? (
															<span className="flex items-center gap-3">
																<div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
																EXECUTING...
															</span>
														) : isLandlord ? (
															<span className="flex items-center gap-3 uppercase">
																You Own This Asset
															</span>
														) : isRentedByOthers ? (
															<span className="flex items-center gap-3 uppercase">
																Property Rented
															</span>
														) : (
															<span className="flex items-center gap-3">
																EXECUTE CONTRACT
																<ArrowRight className="w-6 h-6" />
															</span>
														)}
													</Button>
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>

							{isPending && (
								<div className="p-8 glass rounded-[2.5rem] border-blue-500/20 space-y-4 animate-pulse">
									<div className="flex items-center gap-4">
										<div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
										<p className="font-black uppercase tracking-widest text-[10px] text-blue-400">
											Cardano_Protocol_Indexing
										</p>
									</div>
									<p className="text-gray-400 text-sm font-medium leading-relaxed">
										Submitting lease signature to the ledger. This action is
										irreversible once confirmed.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
