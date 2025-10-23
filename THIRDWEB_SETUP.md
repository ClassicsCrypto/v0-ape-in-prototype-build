# ThirdWeb Integration Setup

This project now includes ThirdWeb SDK integration for wallet connection and Web3 functionality.

## 🚀 Features Added

- **ThirdWeb Provider**: Configured with support for multiple chains (Ethereum, Polygon, Arbitrum, Optimism)
- **Wallet Connection**: Support for MetaMask, Coinbase Wallet, and WalletConnect
- **Chain Switching**: Easy switching between supported networks
- **Custom Hook**: `useWallet()` hook for easy access to wallet state throughout the app

## 📦 Dependencies Installed

- `@thirdweb-dev/react` - React hooks and components
- `@thirdweb-dev/sdk` - Core ThirdWeb SDK
- `@thirdweb-dev/chains` - Predefined chain configurations

## 🔧 Setup Instructions

### 1. Get ThirdWeb Client ID

1. Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
2. Create an account or sign in
3. Create a new project
4. Copy your Client ID

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# ThirdWeb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

### 3. Usage Examples

#### Basic Wallet Connection
```tsx
import { WalletConnection } from "@/components/wallet-connection";

function MyPage() {
  return (
    <div>
      <WalletConnection />
    </div>
  );
}
```

#### Using the Wallet Hook
```tsx
import { useWalletConnection } from "@/components/wallet-connection";

function MyComponent() {
  const { address, chainId, chainName, isConnected, disconnect, switchChain } = useWalletConnection();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <p>Chain: {chainName} (ID: {chainId})</p>
      <button onClick={() => disconnect()}>Disconnect</button>
      <button onClick={() => switchChain(137)}>Switch to Polygon</button>
    </div>
  );
}
```

#### Direct ThirdWeb Hooks
```tsx
import { useAddress, useChainId, useDisconnect, useSwitchChain } from "@thirdweb-dev/react";

function MyComponent() {
  const address = useAddress();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  return (
    <div>
      {address && (
        <p>Address: {address}</p>
      )}
      {chainId && (
        <p>Chain ID: {chainId}</p>
      )}
      <button onClick={() => switchChain(137)}>Switch to Polygon</button>
    </div>
  );
}
```

## 🔗 Supported Networks

- **Ethereum** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)

## 🎨 Customization

### Adding More Chains
Edit `components/thirdweb-provider.tsx`:

```tsx
import { Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche } from "@thirdweb-dev/chains";

const supportedChains = [Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche];
```

### Adding More Wallets
Edit `components/thirdweb-provider.tsx`:

```tsx
import { metamaskWallet, coinbaseWallet, walletConnect, trustWallet } from "@thirdweb-dev/react";

const supportedWallets = [
  metamaskWallet(),
  coinbaseWallet(),
  walletConnect(),
  trustWallet(),
];
```

### Styling the Connect Button
The `ConnectWallet` component accepts various props for customization:

```tsx
<ConnectWallet 
  theme="dark" // or "light"
  modalTitle="Connect to ApeIn"
  modalTitleIcon=""
  modalSize="compact" // or "wide"
  welcomeScreen={{
    title: "Welcome to ApeIn",
    subtitle: "Connect your wallet to get started",
  }}
/>
```

## 🚨 Important Notes

1. **Client ID Required**: You must set up your ThirdWeb Client ID in the environment variables
2. **Network Configuration**: The app defaults to Ethereum but allows switching to other networks
3. **Error Handling**: The wallet connection component includes error handling for common issues
4. **TypeScript**: Full TypeScript support with proper type definitions

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid Client ID"**: Make sure your `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set correctly
2. **Network Not Supported**: Add the chain to the `supportedChains` array
3. **Wallet Not Connecting**: Check browser console for errors and ensure wallet is installed

### Development Tips

- Use browser dev tools to inspect wallet connection state
- Check the ThirdWeb dashboard for project analytics
- Test with different wallets and networks during development

## 📚 Additional Resources

- [ThirdWeb Documentation](https://portal.thirdweb.com/)
- [React SDK Reference](https://portal.thirdweb.com/references/react/v4)
- [Chain Configuration](https://portal.thirdweb.com/references/typescript/v5/Chain)
- [Wallet Configuration](https://portal.thirdweb.com/references/react/v4/ConnectWallet)

