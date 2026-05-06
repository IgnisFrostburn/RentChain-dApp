# Mesh SDK Professional Patterns

## Wallet Connection
Always check if the wallet is already enabled before calling `.enable()`.

```typescript
import { MeshCardanoBrowserWallet } from "@meshsdk/wallet";

async function connect(walletName: string) {
  const wallet = await MeshCardanoBrowserWallet.enable(walletName);
  return wallet;
}
```

## Transaction Building (MeshTxBuilder)
`MeshTxBuilder` is the preferred way to build complex transactions.

```typescript
import { MeshTxBuilder } from "@meshsdk/core";

async function buildTx(wallet: MeshCardanoBrowserWallet, provider: BlockfrostProvider) {
  const txBuilder = new MeshTxBuilder({
    fetcher: provider,
    submitter: provider,
  });

  const utxos = await wallet.getUtxos();
  const changeAddress = await wallet.getChangeAddress();

  const unsignedTx = await txBuilder
    .txOut("addr_test...", [{ unit: "lovelace", quantity: "5000000" }])
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .complete();

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  return txHash;
}
```

## Error Handling
Always wrap blockchain calls in `try/catch`. Handle specific CIP-30 errors like "User Declined" or "Insufficient Funds".
