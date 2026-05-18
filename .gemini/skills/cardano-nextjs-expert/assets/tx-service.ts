import { 
  BlockfrostProvider, 
  MeshTxBuilder, 
  type IBrowserWallet 
} from "@meshsdk/core";

/**
 * Professional Cardano Transaction Service
 * Implements clean code principles by separating Tx logic from the UI.
 */
export class CardanoTxService {
  private txBuilder: MeshTxBuilder;

  constructor(provider: BlockfrostProvider) {
    this.txBuilder = new MeshTxBuilder({
      fetcher: provider,
      submitter: provider,
    });
  }

  /**
   * Sends Lovelace to a recipient address.
   * @param wallet The connected CIP-30 wallet instance.
   * @param recipient The Bech32 address of the recipient.
   * @param amount The amount in Lovelace (string to avoid precision issues).
   * @returns The transaction hash.
   */
  async sendLovelace(
    wallet: IBrowserWallet, 
    recipient: string, 
    amount: string
  ): Promise<string> {
    try {
      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();

      const unsignedTx = await this.txBuilder
        .txOut(recipient, [{ unit: "lovelace", quantity: amount }])
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete();

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      return txHash;
    } catch (error) {
      console.error("CardanoTxService.sendLovelace error:", error);
      throw error;
    }
  }
}
