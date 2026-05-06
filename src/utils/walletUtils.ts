import { MeshCardanoBrowserWallet } from "@meshsdk/react";

export const connectWallet = async (walletName: string): Promise<MeshCardanoBrowserWallet | null> => {
    try {
        if (walletName == "Disconnected") return null;
        const wallet = await MeshCardanoBrowserWallet.enable(walletName);
        console.log("Wallet connected:", wallet);
        return wallet;
    } catch (error) {
        alert("Error connecting wallet: " + error);
        console.error("Error connecting wallet:", error);
        return null;
    }
}

export const getAvailableWallets = () => {
    const wallets = MeshCardanoBrowserWallet.getInstalledWallets();
    return wallets.map(w => w.name);
};
