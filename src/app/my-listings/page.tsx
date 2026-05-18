"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Building2, Terminal, Wallet2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Property } from "@/types/property";

export default function MyListingsPage() {
    const { connectedWalletName, walletAddress, setShowWalletModal } = useWallet();
    const [myListings, setMyListings] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            if (!walletAddress) {
                setMyListings([]);
                setIsLoading(false);
                return;
            }

            try {
                // 1. Fetch all pinned properties from IPFS
                const listingsRes = await fetch('/api/listings');
                const rentedRes = await fetch('/api/rentals');
                
                if (listingsRes.ok && rentedRes.ok) {
                    const listings: Property[] = await listingsRes.json();
                    const rentedCIDs: string[] = await rentedRes.json();

                    // 2. Filter by landlord address and map status
                    const filtered = listings
                        .filter(p => p.landlordAddress?.toLowerCase() === walletAddress.toLowerCase())
                        .map(p => ({
                            ...p,
                            status: (rentedCIDs.includes(p.metadataIpfsHash || '') ? 'Rented' : 'Available') as 'Rented' | 'Available'
                        }));

                    setMyListings(filtered);
                }
            } catch (error) {
                console.error("Error fetching my listings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyListings();
    }, [walletAddress]);

    return (
        <div className="min-h-screen bg-[#030303] text-white crypto-grid">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-500 font-black tracking-widest text-[10px] uppercase">
                            <Terminal className="w-4 h-4" />
                            Terminal / Landlord / Inventory
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.8]">
                            MY <br />
                            <span className="text-gradient">LISTINGS.</span>
                        </h1>
                        <p className="text-gray-500 font-bold text-lg max-w-md leading-snug">
                            Manage your decentralized property inventory and monitor asset status.
                        </p>
                    </div>
                    
                    <Link href="/list-property">
                        <Button className="rounded-2xl bg-white text-black hover:bg-gray-200 h-14 px-8 font-black uppercase tracking-tighter shadow-lg shadow-white/5 transition-all active:scale-95">
                            <PlusCircle className="mr-2 w-5 h-5" />
                            Mint New Asset
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Accessing Inventory Data...</p>
                    </div>
                ) : !connectedWalletName ? (
                    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] p-24 text-center border border-dashed border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 crypto-grid opacity-10" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-8 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                                <Wallet2 className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Auth Required</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold text-lg leading-snug">
                                Connect your wallet to manage your property listings and minted inventory.
                            </p>
                            <Button 
                                onClick={() => setShowWalletModal(true)}
                                size="lg" 
                                className="rounded-[2rem] h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all"
                            >
                                <Wallet2 className="mr-3 w-6 h-6" />
                                Initialize Wallet
                            </Button>
                        </div>
                    </div>
                ) : myListings.length === 0 ? (
                    <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[4rem] p-24 text-center border border-dashed border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 crypto-grid opacity-10" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-8 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                                <Building2 className="w-12 h-12" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Empty Inventory</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold text-lg leading-snug">
                                No properties found for this wallet address. Mint your first property to start earning.
                            </p>
                            <Link href="/list-property">
                                <Button size="lg" className="rounded-[2rem] h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all">
                                    <PlusCircle className="mr-3 w-6 h-6" />
                                    Mint First Asset
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {myListings.map((property) => (
                            <div key={property.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <PropertyCard
                                    id={property.id}
                                    title={property.title}
                                    location={property.location}
                                    rentADA={property.rentADA}
                                    depositADA={property.depositADA}
                                    status={property.status}
                                    imageIpfsHash={property.imageIpfsHash}
                                    metadataIpfsHash={property.metadataIpfsHash}
                                    landlordAddress={property.landlordAddress}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
