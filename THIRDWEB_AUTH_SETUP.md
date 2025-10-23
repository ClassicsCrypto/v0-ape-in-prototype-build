# Thirdweb Social Authentication Setup Guide

This guide will help you set up Google and X (Twitter) authentication using thirdweb's built-in social authentication system.

## ✅ What's Already Implemented

The following components have been updated to use thirdweb's proper social authentication:

1. **ThirdWebProvider** - Updated to include `inAppWallet` with social auth options
2. **ThirdwebSocialAuth** - New component that handles Google and X authentication
3. **SocialConnection** - Updated to use the new thirdweb authentication
4. **Onboarding Page** - Updated to use thirdweb's authentication flow
5. **Callback Pages** - Updated for backward compatibility

## 🔧 Setup Steps

### 1. Create Environment File

Create a `.env.local` file in your project root with the following content:

```bash
# Thirdweb Configuration
# Get your client ID from https://thirdweb.com/dashboard
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

### 2. Get Your Thirdweb Client ID

1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings → API Keys
4. Copy your Client ID
5. Replace `your_thirdweb_client_id_here` in your `.env.local` file

### 3. Configure Social Authentication in Thirdweb Dashboard

1. In your thirdweb dashboard, go to **Authentication** settings
2. Enable the following authentication methods:
   - **Google** - Configure with your Google OAuth credentials
   - **X (Twitter)** - Configure with your X OAuth credentials
   - **Email** - Configure email authentication (optional)

### 4. Test the Setup

Run the test script to verify your configuration:

```bash
node scripts/test-thirdweb-auth.js
```

## 🚀 How It Works

### Authentication Flow

1. **User clicks "Connect X Account" or "Connect Google Account"**
2. **Thirdweb handles the OAuth flow** - No need for custom popup windows
3. **User is redirected to the social platform** for authentication
4. **Thirdweb creates a smart wallet** associated with the social account
5. **User is redirected back** to your app with a connected wallet

### Key Features

- **Smart Wallets**: Each user gets a smart wallet (EIP-4337) that can be sponsored
- **Gas Sponsorship**: Transactions can be sponsored for better UX
- **Multiple Auth Methods**: Users can link multiple social accounts to the same wallet
- **Secure**: Uses thirdweb's battle-tested authentication system

## 🔍 Testing

### Manual Testing

1. Start your development server: `npm run dev`
2. Go to `/onboarding`
3. Click "Connect X Account" or "Connect Google Account"
4. Complete the authentication flow
5. Verify that the wallet is connected and XP is earned

### Automated Testing

The test script checks:
- ✅ Environment variables are set
- ✅ Required packages are installed
- ✅ Thirdweb provider is configured
- ✅ Social auth component is implemented

## 🛠️ Troubleshooting

### Common Issues

1. **"Client ID not found"**
   - Make sure your `.env.local` file exists and has the correct client ID
   - Restart your development server after adding environment variables

2. **"Authentication failed"**
   - Check your thirdweb dashboard configuration
   - Ensure OAuth credentials are properly set up
   - Verify redirect URLs are configured correctly

3. **"Wallet not connecting"**
   - Check browser console for errors
   - Verify thirdweb provider is wrapping your app
   - Ensure the client ID is valid

### Debug Mode

Add this to your `.env.local` for debug information:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
DEBUG=true
```

## 📚 Additional Resources

- [Thirdweb Documentation](https://portal.thirdweb.com/)
- [Social Authentication Guide](https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure)
- [Smart Wallets](https://portal.thirdweb.com/wallets/smart-wallet)
- [Gas Sponsorship](https://portal.thirdweb.com/wallets/smart-wallet/gas-sponsorship)

## 🔄 Migration from Custom OAuth

If you were using custom OAuth flows before:

1. **Remove custom OAuth code** - The new implementation handles this automatically
2. **Update environment variables** - Only `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is needed
3. **Test thoroughly** - Ensure all authentication flows work as expected

The new implementation is more secure, easier to maintain, and provides better user experience with smart wallets and gas sponsorship.

