"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/mockData';
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, PlusCircle, Search } from "lucide-react";

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
        <div className="min-h-screen">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            My <span className="text-blue-600">Rentals.</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your active leases and security deposits on-chain.</p>
                    </div>
                    
                    <Link href="/listings">
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6">
                            <PlusCircle className="mr-2 w-4 h-4" />
                            Find New Property
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-500 font-medium">Fetching your on-chain records...</p>
                    </div>
                ) : rentedProperties.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-md rounded-[3rem] p-16 text-center border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Rentals</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                            You haven&apos;t secured any properties yet. Your future home is just a transaction away.
                        </p>
                        <Link href="/listings">
                            <Button size="lg" className="rounded-2xl h-14 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
                                <Search className="mr-2 w-5 h-5" />
                                Start Browsing
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rentedProperties.map((property) => (
                            <div key={property.id} className="relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-200">
                                        Active Lease
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
