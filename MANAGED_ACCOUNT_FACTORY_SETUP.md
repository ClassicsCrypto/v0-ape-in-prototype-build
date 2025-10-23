# Managed Account Factory Integration

This guide explains how to set up and test your deployed Managed Account Factory contract (`0xe47977a729e152ae112c48c818f78391527b61c5`) with your ApeIn application on the Curtis Network.

## 🚀 What's Been Added

### 1. Contract Configuration (`lib/contracts.ts`)
- Contract address and ABI configuration
- Chain ID mapping for Curtis Network (33111)
- Helper functions for contract interaction

### 2. Managed Account Factory Component (`components/managed-account-factory.tsx`)
- Interactive UI for creating managed accounts
- Address prediction functionality
- Contract state display
- Error handling and loading states

### 3. Environment Configuration (`.env.local`)
- ThirdWeb Client ID configuration
- Contract address and chain ID settings

### 4. Test Pages
- Main page integration (`app/page.tsx`)
- Dedicated test page (`app/contract-test/page.tsx`)

## 🔧 Setup Instructions

### Step 1: Configure Environment Variables

1. **Get your ThirdWeb Client ID:**
   - Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
   - Create a project or use existing one
   - Copy your Client ID

2. **Update `.env.local`:**
   ```bash
   # ThirdWeb Configuration
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id_here
   
   # Contract Configuration (already set for your contract on Curtis Network)
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_ADDRESS=0xe47977a729e152ae112c48c818f78391527b61c5
   NEXT_PUBLIC_MANAGED_ACCOUNT_FACTORY_CHAIN_ID=33111
   ```

### Step 2: Verify Contract Deployment

Your contract is configured for **Curtis Network (Chain ID: 33111)**. Make sure:

1. Your contract is deployed on Curtis Network
2. You have the correct RPC endpoints configured
3. Your wallet can connect to Curtis Network

### Step 3: Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to the test page:**
   - Main page: `http://localhost:3000`
   - Contract test page: `http://localhost:3000/contract-test`

3. **Connect your wallet:**
   - Click "Connect Wallet"
   - Switch to Curtis Network (Chain ID: 33111)

4. **Test contract functions:**
   - View contract information
   - Predict account addresses
   - Create managed accounts

## 🧪 Testing the Contract

### Basic Functionality Test

1. **Connect Wallet:**
   ```
   ✅ Wallet connects successfully
   ✅ Chain switches to Curtis Network (33111)
   ✅ Contract address displays correctly
   ```

2. **Read Contract State:**
   ```
   ✅ Implementation address loads
   ✅ Contract info displays
   ✅ No errors in console
   ```

3. **Predict Account Address:**
   ```
   ✅ Enter admin address
   ✅ Click "Predict Address"
   ✅ Address displays correctly
   ```

4. **Create Managed Account:**
   ```
   ✅ Enter admin address
   ✅ Click "Create Account"
   ✅ Transaction executes successfully
   ✅ Account created event fired
   ```

### Advanced Testing

1. **Test with different admin addresses:**
   - Use your own address as admin
   - Use another address as admin
   - Verify permissions work correctly

2. **Test with initialization data:**
   - Leave init data empty (should work)
   - Add custom init data
   - Verify account initializes correctly

3. **Test error handling:**
   - Try with invalid addresses
   - Test network switching
   - Verify error messages display

## 🔍 Troubleshooting

### Common Issues

1. **"Contract not deployed on this chain"**
   - Ensure you're connected to Curtis Network (Chain ID: 33111)
   - Check RPC endpoints in your ThirdWeb provider

2. **"Invalid Client ID"**
   - Verify `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set correctly
   - Check the ThirdWeb dashboard for the correct Client ID

3. **Transaction fails**
   - Ensure you have sufficient gas (ETH on Curtis Network)
   - Check if the contract address is correct
   - Verify the contract is actually deployed

4. **Wallet connection issues**
   - Make sure Curtis Network is added to your wallet
   - Check browser console for connection errors
   - Try refreshing the page

### Debug Information

The component includes comprehensive logging. Check the browser console for:

- Contract interaction logs
- Transaction details
- Error messages
- Address predictions

## 📊 Contract Functions Available

### Read Functions
- `accountImplementation()` - Get the implementation contract address
- `getAddress(admin, data)` - Predict account address before creation
- `supportsInterface(interfaceId)` - Check interface support

### Write Functions
- `createAccount(admin, data)` - Deploy a new managed account

### Events
- `AccountCreated(account, admin)` - Fired when account is created

## 🚀 Next Steps

1. **Customize the UI:**
   - Modify the component styling
   - Add more contract functions
   - Implement account management features

2. **Add Account Management:**
   - List created accounts
   - Manage account permissions
   - Handle account upgrades

3. **Integration with App Features:**
   - Connect accounts to user profiles
   - Implement account-based features
   - Add transaction history

## 📚 Resources

- [ThirdWeb Managed Account Factory Docs](https://portal.thirdweb.com/contracts/explore/pre-built-contracts/managed-account-factory)
- [ThirdWeb React SDK](https://portal.thirdweb.com/references/react/v4)
- [ApeChain Documentation](https://apechain.com)
- [ERC-4337 Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)

## 🎯 Success Criteria

Your integration is working correctly when:

- ✅ Wallet connects to Curtis Network
- ✅ Contract information loads
- ✅ Address prediction works
- ✅ Account creation succeeds
- ✅ No console errors
- ✅ Transaction receipts are valid

If all these criteria are met, your Managed Account Factory is successfully integrated and ready for production use!
