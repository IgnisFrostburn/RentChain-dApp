'use client';

import Navbar from '@/components/Navbar';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { MapPin, Coins, Info, ArrowRight, Activity, Terminal } from 'lucide-react';

export default function ListPropertyPage() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Listing submission logic would go here. In this demo, listings are static mock data.");
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
                                Transform physical property into a verifiable on-chain rental asset. Join the decentralized economy.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            {[
                                { icon: Activity, title: "On-Chain Verification", desc: "Every listing is hashed and anchored to the Cardano ledger for permanent validity." },
                                { icon: Coins, title: "Liquidity Streams", desc: "Receive automated rental payments in ADA, settled instantly to your treasury address." },
                                { icon: Info, title: "Smart Escrow", desc: "Security deposits are managed by the protocol, eliminating trust requirements." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xl font-black text-white uppercase tracking-tighter">{item.title}</h4>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
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
                                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Asset Metadata</CardTitle>
                                    <CardDescription className="text-gray-500 font-bold">Input the technical parameters for the new asset node.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-12 space-y-10">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Protocol Title</Label>
                                            <Input
                                                id="title"
                                                placeholder="PH_CEBU_STUDIO_01"
                                                className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Geospatial Data</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                                <Input
                                                    id="location"
                                                    placeholder="Coordinate or Address"
                                                    className="h-14 pl-12 rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="rent" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Rent_ADA</Label>
                                                <Input
                                                    id="rent"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-black focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="deposit" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Bond_ADA</Label>
                                                <Input
                                                    id="deposit"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-14 rounded-2xl border-white/5 bg-white/[0.03] text-white font-black focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Node Description</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Define asset amenities and parameters..."
                                                rows={4}
                                                className="rounded-2xl border-white/5 bg-white/[0.03] text-white font-bold focus:border-blue-500/50 focus:ring-blue-500/10 transition-all placeholder:text-gray-800"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-20 rounded-[2rem] bg-white text-black text-xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 group">
                                            Initialize Asset Node
                                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
