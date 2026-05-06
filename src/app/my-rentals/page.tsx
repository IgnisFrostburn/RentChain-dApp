"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/mockData';
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Search, Activity, LayoutDashboard } from "lucide-react";

export default function MyRentalsPage() {
    const [rentedProperties, setRentedProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const rentedIds = JSON.parse(localStorage.getItem("rentedProperties") || "[]");
        const filtered = properties.filter(p => rentedIds.includes(p.id));
        setRentedProperties(filtered);
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-[#030303] text-white crypto-grid">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-500 font-black tracking-widest text-[10px] uppercase">
                            <LayoutDashboard className="w-4 h-4" />
                            Terminal / User / Portfolio
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                            ACTIVE <br />
                            <span className="text-gradient">PORTFOLIO.</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-lg max-w-md leading-snug">Manage your cryptographically secured rental assets and active leases.</p>
                    </div>
                    
                    <Link href="/listings">
                        <Button className="rounded-2xl bg-white text-black hover:bg-gray-200 h-14 px-8 font-black uppercase tracking-tighter shadow-lg shadow-white/5 transition-all active:scale-95">
                            <PlusCircle className="mr-2 w-5 h-5" />
                            New Lease
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Synchronizing with Ledger...</p>
                    </div>
                ) : rentedProperties.length === 0 ? (
                    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] p-24 text-center border border-dashed border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 crypto-grid opacity-10" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-8 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                                <Activity className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Zero Active Leases</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold text-lg leading-snug">
                                No cryptographic agreements detected at this address. Initialize a new lease from the terminal.
                            </p>
                            <Link href="/listings">
                                <Button size="lg" className="rounded-[2rem] h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all">
                                    <Search className="mr-3 w-6 h-6" />
                                    Explore Terminal
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {rentedProperties.map((property) => (
                            <div key={property.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="absolute top-6 right-6 z-20">
                                    <div className="bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 border border-emerald-400">
                                        Active_Node
                                    </div>
                                </div>
                                <PropertyCard
                                    id={property.id}
                                    title={property.title}
                                    location={property.location}
                                    rentADA={property.rentADA}
                                    depositADA={property.depositADA}
                                    status="Rented"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
