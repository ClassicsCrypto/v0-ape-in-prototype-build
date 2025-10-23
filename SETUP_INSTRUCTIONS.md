# Quick Setup Instructions

## ✅ Issues Fixed

1. **Clear Instructions**: Added prominent "Choose One Option" message on the onboarding screen
2. **Working Connect Buttons**: Replaced custom buttons with thirdweb's reliable `ConnectEmbed` component
3. **QueryClient Error**: Fixed "No QueryClient set" error by adding TanStack Query provider

## 🚀 To Complete Setup

### 1. Create `.env.local` file
Create a file named `.env.local` in your project root with:

```bash
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
```

### 2. Get your thirdweb Client ID
1. Go to [thirdweb.com/dashboard](https://thirdweb.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API Keys**
4. Copy your **Client ID**
5. Replace `your_thirdweb_client_id_here` in your `.env.local` file

### 3. Test the setup
```bash
node scripts/test-thirdweb-auth.js
```

## 🎯 What's Now Working

- **Clear Instructions**: Users see "Choose One Option" message
- **Working Authentication**: Uses thirdweb's `ConnectEmbed` for reliable social auth
- **Google & X Support**: Both authentication methods are available
- **XP Rewards**: Users earn 50 XP for connecting
- **Smart Wallets**: Each user gets a smart wallet automatically

## 🔧 How It Works Now

1. User sees clear "Choose One Option" instruction
2. User clicks the connect button
3. thirdweb's modal opens with Google and X options
4. User selects their preferred method
5. Authentication completes and wallet is created
6. User earns XP and proceeds to next step

The authentication is now much more reliable and user-friendly!
