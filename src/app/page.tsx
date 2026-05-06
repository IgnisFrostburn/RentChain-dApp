import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Wallet, ShieldCheck, Coins, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <Navbar />
            
            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 flex flex-col items-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-[400px] bg-blue-500/20 blur-[120px] rounded-full" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            SECURED BY CARDANO
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 mb-6 drop-shadow-sm">
                            Rent with <span className="text-gradient">Certainty.</span>
                        </h1>
                        
                        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-medium">
                            The world&apos;s first trustless peer-to-peer rental protocol. No middlemen, no disputes, just smart contracts.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/listings">
                                <Button size="lg" className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-2xl group transition-all">
                                    Browse Properties
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/list-property">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 rounded-2xl bg-white/50 backdrop-blur-sm transition-all">
                                    Become a Landlord
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 relative bg-white/30 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why RentChain?</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Built for the future of decentralized living.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Wallet,
                                    title: "Wallet Connected",
                                    desc: "Seamlessly browse and pay using your favorite Cardano wallet. Pure Web3 experience.",
                                    color: "bg-blue-500"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Escrow Secured",
                                    desc: "Security deposits are held in audited smart contracts, never in a landlord's bank account.",
                                    color: "bg-emerald-500"
                                },
                                {
                                    icon: Coins,
                                    title: "Native ADA",
                                    desc: "Pay rent and receive deposits instantly in ADA. No more wire transfer delays.",
                                    color: "bg-orange-500"
                                }
                            ].map((feature, i) => (
                                <Card key={i} className="glass group hover:-translate-y-2 transition-all duration-300">
                                    <CardContent className="p-8">
                                        <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                                            <feature.icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 space-y-8">
                                <h2 className="text-5xl font-black text-gray-900 leading-tight">
                                    How it <span className="text-blue-600">works.</span>
                                </h2>
                                
                                <div className="space-y-6">
                                    {[
                                        { step: "01", title: "Find your place", desc: "Browse verified listings with transparent ADA pricing." },
                                        { step: "02", title: "Sign & Pay", desc: "Execute the lease and pay deposit via a single transaction." },
                                        { step: "03", title: "Move in", desc: "Receipts are stored on-chain. Trust is programmed into the lease." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="text-4xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">{item.step}</div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="text-gray-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full max-w-xl">
                                <div className="glass rounded-[3rem] p-4 relative overflow-hidden shadow-2xl rotate-2">
                                    <div className="bg-gray-900 rounded-[2.5rem] p-8 aspect-square flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="w-12 h-2 bg-blue-500 rounded-full" />
                                                <div className="w-24 h-6 bg-white/20 rounded-md" />
                                            </div>
                                            <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-blue-500" />
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="w-16 h-4 bg-white/10 rounded-full" />
                                                <div className="w-16 h-4 bg-white/10 rounded-full" />
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600" />
                                                <div className="space-y-1">
                                                    <div className="w-20 h-3 bg-white/20 rounded-full" />
                                                    <div className="w-12 h-2 bg-white/10 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="text-white font-bold">500 ADA</div>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/30 blur-[60px] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 border-t border-gray-200/50 bg-white/50 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white text-[10px] font-bold">R</div>
                            <span className="font-bold text-gray-900">RentChain</span>
                        </div>
                        <p className="text-gray-500 text-sm">Built with ❤️ for the Cardano community.</p>
                        <div className="flex gap-6 text-sm font-medium text-gray-600">
                            <Link href="#" className="hover:text-blue-600 transition">Twitter</Link>
                            <Link href="#" className="hover:text-blue-600 transition">GitHub</Link>
                            <Link href="#" className="hover:text-blue-600 transition">Terms</Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
