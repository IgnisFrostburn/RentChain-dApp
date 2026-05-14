import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

const getProvider = () => {
    const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
    if (!apiKey) {
        throw new Error("Blockfrost API key is missing. Please set NEXT_PUBLIC_BLOCKFROST_PROJECT_ID in your .env file.");
    }
    return new BlockfrostProvider(apiKey);
};

export const waitForTransaction = async (txHash: string, maxAttempts = 20, interval = 5000): Promise<boolean> => {
    console.log(`Polling for transaction: ${txHash}...`);
    
    const provider = getProvider();
    
    // Initial delay: Give the network/Blockfrost a head start (10s)
    await new Promise((resolve) => setTimeout(resolve, 10000));

    for (let i = 0; i < maxAttempts; i++) {
        try {
            const txInfo = await provider.fetchTxInfo(txHash);
            if (txInfo) {
                console.log("Transaction found and confirmed!");
                return true;
            }
        } catch (error: any) {
            if (error?.status === 404 || error?.message?.includes('404')) {
                console.log(`Transaction not yet indexed (Attempt ${i + 1}/${maxAttempts})...`);
            } else {
                console.error("Unexpected error while fetching transaction info:", error);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
};

export const sendLovelace = async (
    wallet: MeshCardanoBrowserWallet,
    recipientAddress: string,
    recipientAmount: string
): Promise<string> => {
    const provider = getProvider();
    const txBuilder = new MeshTxBuilder({
        fetcher: provider,
        verbose: true,
    });

    const utxos = await (wallet.getUtxosMesh());
    const changeAddress = await wallet.getChangeAddressBech32();

    if (utxos == null) {
        alert("No UTXOs found in wallet");
        throw new Error("No UTXOs found in wallet");
    }

    const unsignedTx = await txBuilder
        .txOut(
            recipientAddress,
            [{ unit: "lovelace", quantity: recipientAmount }]
        )
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

    const signedTx = await wallet.signTxReturnFullTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);


    return txHash;
}
