"use client";
import { useState, useEffect } from "react";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
import Link from "next/link";
import Navbar from "./Navbar";
import { sendLovelace, waitForTransaction } from "@/utils/transaction";
import WalletModal from "./WalletModal";
import { getAvailableWallets, connectWallet } from "@/utils/walletUtils";

export default function PropertyDetail({ property }: { property: any }) {
    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
    const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    // Check if property is already rented in this session/local
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
            console.log("Transaction submitted:", hash);

            // Wait for confirmation
            const confirmed = await waitForTransaction(hash);
            if (confirmed) {
                setIsConfirmed(true);
                // Persist rented status
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
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${isConfirmed
                                    ? 'bg-blue-100 text-blue-800'
                                    : property.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {isConfirmed ? 'Paid / Rented' : property.status}
                                </span>
                            </div>

                            <p className="text-xl text-gray-600 mb-8">{property.location}</p>

                            {isConfirmed && (
                                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">🎉 Rental Confirmed!</h3>
                                    <p className="text-blue-700">
                                        Your payment has been verified on the Cardano blockchain. 
                                        You can now view this in your <Link href="/my-rentals" className="underline font-bold">My Rentals</Link> dashboard.
                                    </p>
                                    {txHash && (
                                        <p className="mt-2 text-sm text-blue-600 font-mono break-all">
                                            Tx Hash: {txHash}
                                        </p>
                                    )}
                                </div>
                            )}

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
                                {!isConfirmed && (
                                    <>
                                        <button 
                                            onClick={() => setShowWalletModal(true)} 
                                            disabled={isPending}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-blue-300"
                                        >
                                            {connectedWalletName ? `Connected: ${connectedWalletName}` : "Connect Wallet to Rent"}
                                        </button>
                                        <button
                                            disabled={!wallet || isPending}
                                            className={`w-full font-bold py-3 px-6 rounded-lg ${!wallet || isPending
                                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                : "bg-lime-600 text-white cursor-pointer hover:bg-lime-700"
                                                }`}
                                            onClick={handlePayment}
                                        >
                                            {isPending ? "Processing..." : "Pay Deposit & Sign Agreement"}
                                        </button>
                                    </>
                                )}
                                {isConfirmed && (
                                    <Link 
                                        href="/my-rentals"
                                        className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition"
                                    >
                                        View in Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}




