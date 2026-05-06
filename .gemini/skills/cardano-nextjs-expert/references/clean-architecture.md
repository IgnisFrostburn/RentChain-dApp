# Clean Architecture for Cardano dApps

Maintain a clean codebase by separating blockchain concerns from the UI.

## 1. Directory Structure
```text
src/
├── components/     # Pure UI components
├── hooks/          # useWallet, useAssets
├── services/       # CardanoTxService, CardanoDataService
└── utils/          # Formatting, environment checks
```

## 2. The Service Pattern
Extract transaction building into a service class or set of pure functions.

```typescript
// src/services/transaction.service.ts
export class TransactionService {
  static async sendPayment(wallet: BrowserWallet, recipient: string, amount: string) {
    // Transaction logic here
  }
}
```

## 3. Custom Hooks for State
Use hooks to manage wallet state and exposure.

```typescript
// src/hooks/useCardano.ts
export function useCardano() {
  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  // ... connection logic
  return { wallet, connect, isConnected: !!wallet };
}
```

## 4. RSC vs. Client Components
- Use **Server Components** to fetch blockchain data (via Blockfrost) for SEO and initial load speed.
- Use **Client Components** only for wallet interaction and transaction signing.
