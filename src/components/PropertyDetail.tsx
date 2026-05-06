"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import Link from "next/link";
import Navbar from "./Navbar";
import { sendLovelace } from "@/utils/transaction";
import WalletModal from "./WalletModal";
import { getAvailableWallets, connectWallet } from "@/utils/walletUtils";

export default function PropertyDetail({ property }: { property: any }) {
    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const connect = async (walletName: string) => {
        const wallet = await connectWallet(walletName);
        setWallet(wallet);
    }

    useEffect(() => {
        const wallets = getAvailableWallets();
        setAvailableWallets(wallets);
    }, []);

    if (!property) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
                        <Link href="/listings" className="text-blue-600 hover:text-blue-700 mt-4">
                            Back to Listings
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link href="/listings" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
                        ← Back to Listing
                    </Link>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {property.title}
                                </h1>
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${property.status === 'Available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {property.status}
                                </span>
                            </div>

                            <p className="text-xl text-gray-600 mb-8">{property.location}</p>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 text-lg">{property.description}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <p className="text-gray-600 mb-2">Rent per Month</p>
                                    <p className="text-3xl font-bold text-blue-600">{property.rentADA} ADA</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <p className="text-gray-600 mb-2">Security Deposit</p>
                                    <p className="text-3xl font-bold text-orange-600">{property.depositADA} ADA</p>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-gray-100 rounded-lg">
                                <p className="text-gray-600 mb-2">Landlord Wallet Address</p>
                                <p className="text-lg font-mono text-gray-800">{property.landlordAddress}</p>
                            </div>

                            {showWalletModal &&
                                <WalletModal
                                    availableWallets={availableWallets}
                                    onClose={() => setShowWalletModal(false)}
                                    onSelectWallet={(walletName) => {
                                        connect(walletName);
                                    }}
                                />
                            }


                            <div className="space-y-4">
                                <button onClick={() => setShowWalletModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                                    Connect Wallet to Rent
                                </button>
                                <button
                                    disabled={!wallet}
                                    className={`w-full font-bold py-3 px-6 rounded-lg ${!wallet
                                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        : "bg-lime-600 text-white cursor-pointer, hover:bg-lime-700"
                                        }`}
                                    onClick={() => {
                                        if (!wallet) {
                                            console.error("No wallet connected");
                                            return;
                                        }
                                        sendLovelace(
                                            wallet,
                                            property.landlordAddress,
                                            (property.depositADA * 1000000).toString(),
                                        );
                                    }}
                                >
                                    Pay Deposit & Sign Agreement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}




