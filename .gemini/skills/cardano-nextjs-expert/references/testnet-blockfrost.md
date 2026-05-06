# Testnet & Blockfrost Configuration

Professional Cardano development requires a clear separation of networks.

## Network Selection

- **Preview**: Closest to Mainnet behavior. Ideal for final staging and performance testing.
- **Preprod**: Long-lived testnet. Best for integration testing with other services and DExs.

## Blockfrost Setup

Store your project IDs in `.env.local`. NEVER commit these keys.

```env
# .env.local
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_PREPROD=preprod_...
BLOCKFROST_PROJECT_ID_PREPROD=preprod_...
```

## Provider Initialization

Use the `BlockfrostProvider` from Mesh SDK.

```typescript
import { BlockfrostProvider } from "@meshsdk/core";

const provider = new BlockfrostProvider(
  process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID_PREPROD!
);
```

## Security Best Practices
- Use `NEXT_PUBLIC_` only for keys required on the client side (like fetching public data).
- Keep sensitive operations (like submitting signed transactions or interacting with private APIs) on the server side or use a proxy to hide keys.
