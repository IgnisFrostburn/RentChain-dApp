"use client";
import { useState, useEffect } from "react";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import Link from "next/link";
import Navbar from "./Navbar";
import { sendLovelace, waitForTransaction } from "@/utils/transaction";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { 
    ChevronLeft, 
    MapPin, 
    ShieldCheck, 
    Wallet, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight,
    Info,
    Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PropertyDetail({ property }: { property: any }) {
    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
    const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    useEffect(() => {
        const rentedProperties = JSON.parse(localStorage.getItem("rentedProperties") || "[]");
        if (property && rentedProperties.includes(property.id)) {
            setIsConfirmed(true);
        }
    }, [property]);

    const handlePayment = async () => {
        if (!wallet || !property) return;
        try {
            setIsPending(true);
            const hash = await sendLovelace(
                wallet,
                property.landlordAddress,
                (property.depositADA * 1000000).toString()
            );
            setTxHash(hash);
            const confirmed = await waitForTransaction(hash);
            if (confirmed) {
                setIsConfirmed(true);
                const rentedProperties = JSON.parse(localStorage.getItem("rentedProperties") || "[]");
                if (!rentedProperties.includes(property.id)) {
                    rentedProperties.push(property.id);
                    localStorage.setItem("rentedProperties", JSON.stringify(rentedProperties));
                }
            } else {
                alert("Transaction submission timed out. Please check your wallet.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Error processing payment. See console for details.");
        } finally {
            setIsPending(false);
        }
    };

    const connectWallet = async (walletName: string) => {
        try {
            if (walletName == "Disconnected") return;
            const wallet = await MeshCardanoBrowserWallet.enable(walletName);
            setWallet(wallet);
            setConnectedWalletName(walletName);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    }

    useEffect(() => {
        const getAvailableWallets = async () => {
            try {
                const wallets = MeshCardanoBrowserWallet.getInstalledWallets();
                const walletNames = wallets.map((wallet) => wallet.name);
                setAvailableWallets(walletNames);
            } catch (error) {
                console.error("Error fetching available wallets:", error);
            }
        };
        getAvailableWallets();
    }, []);

    if (!property) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main className="max-w-4xl mx-auto px-4 py-24 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
                    <Link href="/listings" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to Listings
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/listings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors group">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to all listings
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge variant={isConfirmed ? "success" : property.status === "Available" ? "success" : "warning"} className="h-7 px-4">
                                    {isConfirmed ? "Rented by You" : property.status}
                                </Badge>
                                <Badge variant="outline" className="h-7 px-4 bg-white/50 border-gray-200">
                                    <ShieldCheck className="w-3 h-3 mr-1.5 text-blue-500" />
                                    Verified Listing
                                </Badge>
                            </div>
                            
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
                                {property.title}
                            </h1>
                            
                            <div className="flex items-center text-xl text-gray-500 font-medium">
                                <MapPin className="w-6 h-6 mr-2 text-blue-500" />
                                {property.location}
                            </div>
                        </section>

                        <div className="aspect-[16/9] rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-100/50 relative overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center text-blue-200 group-hover:scale-110 transition-transform duration-700">
                                <Building2 className="w-48 h-48 opacity-20" />
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 p-8 glass rounded-3xl">
                                <p className="text-gray-900 font-bold text-xl mb-1">Modern Urban Living</p>
                                <p className="text-gray-600">Experience the best of {property.location.split(',')[0]} in this premium space.</p>
                            </div>
                        </div>

                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Description</h2>
                            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                {property.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                                {[
                                    { label: 'Type', value: 'Studio Unit' },
                                    { label: 'Area', value: '45 sqm' },
                                    { label: 'Furnished', value: 'Yes' },
                                    { label: 'Lease', value: '6-12 Months' },
                                ].map((spec, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                                        <p className="text-gray-900 font-bold">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-gray-900 text-white relative overflow-hidden">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3 opacity-60">
                                    <Info className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Protocol Intelligence</span>
                                </div>
                                <h3 className="text-2xl font-bold">Landlord Reputation Verified</h3>
                                <p className="text-gray-400 max-w-lg">
                                    The landlord address <span className="text-blue-400 font-mono break-all">{property.landlordAddress}</span> has a 100% on-chain success rate with 0 disputes.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-32 -mt-32" />
                        </section>
                    </div>

                    {/* Right Column: Transaction */}
                    <div className="space-y-8">
                        <Card className="sticky top-24 rounded-[2.5rem] border-none shadow-2xl shadow-blue-200/50 overflow-hidden">
                            <CardHeader className="bg-blue-600 text-white p-8">
                                <CardTitle className="text-lg opacity-80 uppercase tracking-widest mb-2 font-bold">Rental Summary</CardTitle>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black">{property.rentADA}</span>
                                    <span className="text-xl font-bold opacity-80">ADA / mo</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                        <span className="text-gray-500 font-medium">Security Deposit</span>
                                        <span className="text-xl font-black text-gray-900">{property.depositADA} ADA</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-gray-50 font-bold">
                                        <span className="text-gray-900">Initial Payment</span>
                                        <span className="text-2xl font-black text-blue-600">{(property.rentADA + property.depositADA)} ADA</span>
                                    </div>
                                </div>

                                {isConfirmed ? (
                                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center animate-in zoom-in duration-500">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-200">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                        <h4 className="text-xl font-bold text-emerald-900 mb-2">Rental Active</h4>
                                        <p className="text-emerald-700 text-sm mb-2 font-medium">Congratulations! You are now the tenant of this property.</p>
                                        {txHash && (
                                            <p className="text-[10px] text-emerald-600 font-mono mb-6 break-all opacity-70">
                                                Tx: {txHash}
                                            </p>
                                        )}
                                        <Link href="/my-rentals" className="w-full">
                                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12">
                                                View in Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {!connectedWalletName ? (
                                            <Button 
                                                onClick={() => setShowWalletModal(true)} 
                                                className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-black text-white text-lg font-bold transition-all shadow-xl shadow-gray-200 group"
                                            >
                                                <Wallet className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                                                Connect Wallet
                                            </Button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                            {connectedWalletName[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Connected</p>
                                                            <p className="text-gray-900 font-bold">{connectedWalletName}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => setConnectedWalletName(null)} className="text-blue-600 hover:bg-blue-100 font-bold">
                                                        Switch
                                                    </Button>
                                                </div>

                                                <Button
                                                    disabled={isPending}
                                                    onClick={handlePayment}
                                                    className={cn(
                                                        "w-full h-16 rounded-2xl text-lg font-bold transition-all shadow-xl",
                                                        isPending 
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                                                    )}
                                                >
                                                    {isPending ? (
                                                        <span className="flex items-center gap-3">
                                                            <Clock className="w-6 h-6 animate-spin" />
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-2">
                                                            Rent Property Now
                                                            <ArrowRight className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                        
                                        <p className="text-[10px] text-center text-gray-400 font-medium px-4 leading-relaxed">
                                            By clicking above, you agree to the smart contract terms and will initiate a secure ADA transaction.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {isPending && (
                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-900 mb-1">On-Chain Indexing...</h4>
                                        <p className="text-sm text-amber-800 opacity-80 leading-snug">
                                            Cardano is securing your transaction. This usually takes 20-40 seconds. Please do not refresh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Wallet Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-md rounded-[2rem] border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <CardTitle className="text-2xl font-black text-gray-900">Connect Wallet</CardTitle>
                                    <p className="text-gray-500 font-medium mt-1">Select your preferred Cardano provider.</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setShowWalletModal(false)}
                                    className="rounded-full hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-6 h-6 rotate-45" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-6 space-y-3">
                            {availableWallets.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wallet className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500">No wallets detected in your browser.</p>
                                    <Button variant="link" className="text-blue-600 mt-2">How to install?</Button>
                                </div>
                            ) : (
                                availableWallets.map((w) => (
                                    <button
                                        key={w}
                                        onClick={() => {
                                            connectWallet(w);
                                            setShowWalletModal(false);
                                        }}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <div className="w-6 h-6 bg-blue-600 rounded-md" />
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg capitalize">{w}</span>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-blue-600 rotate-180 transition-colors" />
                                    </button>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
