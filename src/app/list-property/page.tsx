'use client';

import Navbar from '@/components/Navbar';
import { FormEvent } from 'react';
import { getAvailableWallets, connectWallet } from '@/utils/walletUtils';
import { MeshCardanoBrowserWallet } from '@meshsdk/wallet';
import { useEffect, useState } from 'react';
import WalletModal from '@/components/WalletModal';

export default function ListPropertyPage() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [usedAddress, setUsedAddress] = useState("");

    const connect = async (walletName: string) => {
        const wallet = await connectWallet(walletName);
        setWallet(wallet);
        const addresses = await wallet?.getUsedAddressesBech32()
        setUsedAddress(addresses?.[0] || "");
        console.log("Connected wallet with main address:", addresses?.[0]);
    }

    useEffect(() => {
        const wallets = getAvailableWallets();
        setAvailableWallets(wallets);
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">List Your Property</h1>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Property Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                                    Property Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="e.g., Studio in Downtown"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Describe your property..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                ></textarea>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    placeholder="e.g., Cebu City, Philippines"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            {/* Rent Amount */}
                            <div>
                                <label htmlFor="rent" className="block text-sm font-medium text-gray-900 mb-2">
                                    Rent Amount (ADA)
                                </label>
                                <input
                                    type="number"
                                    id="rent"
                                    placeholder="e.g., 200"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            {/* Deposit Amount */}
                            <div>
                                <label htmlFor="deposit" className="block text-sm font-medium text-gray-900 mb-2">
                                    Deposit Amount (ADA)
                                </label>
                                <input
                                    type="number"
                                    id="deposit"
                                    placeholder="e.g., 400"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            {/* Wallet Address */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                                    Landlord Wallet Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="e.g., addr1..."
                                    disabled
                                    value={usedAddress}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-not-allowed bg-gray-100"
                                />
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

                            {/* Connect Button */}
                            <button
                                onClick={() => setShowWalletModal(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Connect Wallet
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                            >
                                Submit Listing
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
