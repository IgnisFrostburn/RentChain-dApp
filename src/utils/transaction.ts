import { BlockfrostProvider, MeshTxBuilder } from "@meshsdk/core";
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";
const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;

if (!apiKey) throw new Error("Blockfrost API key error");

const provider = new BlockfrostProvider(apiKey);
const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    verbose: true,
});

export const sendLovelace = async (
    wallet: MeshCardanoBrowserWallet,
    recipientAddress: string,
    recipientAmount: string
): Promise<string> => {
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