"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

interface WalletContextType {
    wallet: MeshCardanoBrowserWallet | null;
    connectedWalletName: string | null;
    walletAddress: string | null;
    connectWallet: (walletName: string) => Promise<void>;
    disconnectWallet: () => void;
    availableWallets: string[];
    showWalletModal: boolean;
    setShowWalletModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType>({
    wallet: null,
    connectedWalletName: null,
    walletAddress: null,
    connectWallet: async () => {},
    disconnectWallet: () => {},
    availableWallets: [],
    showWalletModal: false,
    setShowWalletModal: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useState<MeshCardanoBrowserWallet | null>(null);
    const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<string[]>([]);
    const [showWalletModal, setShowWalletModal] = useState(false);

    useEffect(() => {
        const getAvailableWallets = async () => {
            try {
                const wallets = MeshCardanoBrowserWallet.getInstalledWallets();
                const walletNames = wallets.map((w) => w.name);
                setAvailableWallets(walletNames);
            } catch (error) {
                console.error("Error fetching available wallets:", error);
            }
        };
        getAvailableWallets();

        const savedWalletName = localStorage.getItem('connectedWallet');
        if (savedWalletName) {
            connectWallet(savedWalletName);
        }
    }, []);

    const connectWallet = async (walletName: string) => {
        try {
            const w = await MeshCardanoBrowserWallet.enable(walletName);
            const address = await w.getChangeAddressBech32();
            setWallet(w);
            setConnectedWalletName(walletName);
            setWalletAddress(address);
            localStorage.setItem('connectedWallet', walletName);
            setShowWalletModal(false);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            localStorage.removeItem('connectedWallet');
        }
    };

    const disconnectWallet = () => {
        setWallet(null);
        setConnectedWalletName(null);
        setWalletAddress(null);
        localStorage.removeItem('connectedWallet');
    };

    return (
        <WalletContext.Provider value={{ 
            wallet, 
            connectedWalletName, 
            walletAddress, 
            connectWallet, 
            disconnectWallet, 
            availableWallets,
            showWalletModal,
            setShowWalletModal
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
