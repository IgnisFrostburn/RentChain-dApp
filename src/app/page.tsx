import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, ArrowRight, Zap, Globe, Cpu } from "lucide-react";

export default function HomePage() {
	return (
		<>
			<Navbar />
			<div className="relative min-h-screen bg-[#030303] text-white overflow-hidden crypto-grid">
				{/* Background Orbs */}
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />

				<main className="relative z-10">
					{/* Hero Section */}
					<section className="pt-24 pb-32">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
							<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black mb-10 tracking-[0.2em] uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
								<Zap className="w-3 h-3 fill-current" />
								Cardano Mainnet Ready
							</div>

							<h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.85] animate-in fade-in zoom-in duration-700">
								RENTING <br />
								<span className="text-gradient drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
									EVOLVED.
								</span>
							</h1>

							<p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
								Decentralized protocol for trustless rentals.{" "}
								<br className="hidden md:block" />
								No middleman. No bias. Just code.
							</p>

							<div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
								<Link href="/listings">
									<Button
										size="lg"
										className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all active:scale-95 group">
										Launch App
										<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
								<Link href="/list-property">
									<Button
										size="lg"
										variant="outline"
										className="h-16 px-10 text-lg border-white/10 hover:bg-white/5 text-white font-black rounded-2xl backdrop-blur-md transition-all">
										Protocol Access
									</Button>
								</Link>
							</div>

							{/* Stats Banner */}
							<div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12 animate-in fade-in duration-1000 delay-500">
								{[
									{ label: "Transactions", val: "1.2k+" },
									{ label: "TVL Locked", val: "450k ADA" },
									{ label: "Active Nodes", val: "64" },
									{ label: "Protocol Fee", val: "0.5%" },
								].map((stat, i) => (
									<div
										key={i}
										className="text-center">
										<p className="text-3xl font-black text-white">{stat.val}</p>
										<p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
											{stat.label}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* Cyber Card Section */}
					<section className="py-32 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid lg:grid-cols-2 gap-20 items-center">
								<div className="space-y-10">
									<h2 className="text-5xl font-black tracking-tighter leading-tight">
										TRUST IS <br />
										<span className="text-blue-500">PROGRAMMABLE.</span>
									</h2>
									<div className="space-y-8">
										{[
											{
												icon: ShieldCheck,
												title: "Immutable Escrow",
												desc: "Smart contracts hold security deposits. Payouts are triggered by verifiable on-chain events.",
											},
											{
												icon: Globe,
												title: "Borderless Access",
												desc: "Connect from anywhere. Rent from anyone. Cardano's global infrastructure powers every lease.",
											},
											{
												icon: Cpu,
												title: "Automated Compliance",
												desc: "Identity and rental history are hashed and verified. Privacy-first, zero-knowledge reputation.",
											},
										].map((feature, i) => (
											<div
												key={i}
												className="flex gap-6 items-start group">
												<div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0">
													<feature.icon className="w-7 h-7" />
												</div>
												<div>
													<h4 className="text-xl font-black text-white mb-2">
														{feature.title}
													</h4>
													<p className="text-gray-400 font-medium leading-relaxed">
														{feature.desc}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="relative">
									<div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
									<Card className="glass-card relative overflow-hidden rounded-[2.5rem] border-white/10 p-1">
										<div className="bg-[#0a0a0a] rounded-[2.4rem] p-10 space-y-8">
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-3">
													<div className="w-3 h-3 bg-red-500 rounded-full" />
													<div className="w-3 h-3 bg-yellow-500 rounded-full" />
													<div className="w-3 h-3 bg-green-500 rounded-full" />
												</div>
												<Badge
													variant="outline"
													className="border-blue-500/30 text-blue-400 font-black">
													ACTIVE_NODE_V2
												</Badge>
											</div>

											<div className="space-y-6 font-mono text-sm">
												<p className="text-blue-400">
													# Initializing RentChain Protocol...
												</p>
												<p className="text-gray-500">
													{">"} Connecting to Cardano Node...
												</p>
												<p className="text-emerald-400">
													{">"} Connection established [Block: 9482103]
												</p>
												<div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
													<span className="text-gray-400">
														Verification Hash
													</span>
													<span className="text-white font-bold">
														0x7a2...f89e
													</span>
												</div>
												<p className="text-gray-500">
													{">"} Awaiting transaction signatures...
												</p>
											</div>

											<div className="h-[200px] flex items-end gap-2">
												{[40, 70, 45, 90, 65, 80, 50, 85, 95, 60].map(
													(h, i) => (
														<div
															key={i}
															className="flex-1 bg-gradient-to-t from-blue-600/50 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
															style={{ height: `${h}%` }}
														/>
													),
												)}
											</div>
										</div>
									</Card>
								</div>
							</div>
						</div>
					</section>

					{/* Footer */}
					<footer className="py-20 border-t border-white/5 relative bg-black">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
							<div className="flex flex-col items-center md:items-start gap-4">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black">
										R
									</div>
									<span className="font-black text-xl tracking-tighter uppercase">
										RentChain
									</span>
								</div>
								<p className="text-gray-500 text-sm font-medium">
									© 2026 DECENTRALIZED RENTAL PROTOCOL.
								</p>
							</div>

							<div className="flex gap-10 text-xs font-black uppercase tracking-widest text-gray-500">
								<Link
									href="#"
									className="hover:text-blue-400 transition">
									Network
								</Link>
								<Link
									href="#"
									className="hover:text-blue-400 transition">
									Governance
								</Link>
								<Link
									href="#"
									className="hover:text-blue-400 transition">
									Privacy
								</Link>
								<Link
									href="#"
									className="hover:text-blue-400 transition">
									Terminal
								</Link>
							</div>
						</div>
					</footer>
				</main>
			</div>
		</>
	);
}
