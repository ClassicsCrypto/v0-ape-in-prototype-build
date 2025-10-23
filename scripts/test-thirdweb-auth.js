#!/usr/bin/env node

/**
 * Test script to verify thirdweb authentication setup
 * This script checks if the thirdweb configuration is properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing thirdweb authentication setup...\n');

// Check if required environment variables are set
function checkEnvironmentVariables() {
  console.log('📋 Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_THIRDWEB_CLIENT_ID'
  ];
  
  const missingVars = [];
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env.local file not found');
    console.log('   Please create a .env.local file with your thirdweb client ID');
    return false;
  }
  
  // Read .env.local
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  for (const varName of requiredVars) {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing or empty environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

// Check if thirdweb packages are installed
function checkThirdwebPackages() {
  console.log('\n📦 Checking thirdweb packages...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredPackages = [
    '@thirdweb-dev/react',
    '@thirdweb-dev/chains',
    '@thirdweb-dev/sdk'
  ];
  
  const missingPackages = [];
  
  for (const pkg of requiredPackages) {
    if (!packageJson.dependencies[pkg]) {
      missingPackages.push(pkg);
    }
  }
  
  if (missingPackages.length > 0) {
    console.log('❌ Missing thirdweb packages:');
    missingPackages.forEach(pkg => {
      console.log(`   - ${pkg}`);
    });
    console.log('\n   Run: npm install ' + missingPackages.join(' '));
    return false;
  }
  
  console.log('✅ All required thirdweb packages are installed');
  return true;
}

// Check if the thirdweb provider is properly configured
function checkThirdwebProvider() {
  console.log('\n⚙️  Checking thirdweb provider configuration...');
  
  const providerPath = path.join(process.cwd(), 'components', 'thirdweb-provider.tsx');
  
  if (!fs.existsSync(providerPath)) {
    console.log('❌ thirdweb-provider.tsx not found');
    return false;
  }
  
  const providerContent = fs.readFileSync(providerPath, 'utf8');
  
  // Check for required imports
  const requiredImports = [
    'inAppWallet',
    'ThirdwebProvider'
  ];
  
  const missingImports = [];
  for (const importName of requiredImports) {
    if (!providerContent.includes(importName)) {
      missingImports.push(importName);
    }
  }
  
  if (missingImports.length > 0) {
    console.log('❌ Missing imports in thirdweb-provider.tsx:');
    missingImports.forEach(importName => {
      console.log(`   - ${importName}`);
    });
    return false;
  }
  
  // Check for inAppWallet configuration
  if (!providerContent.includes('inAppWallet({')) {
    console.log('❌ inAppWallet not configured in thirdweb-provider.tsx');
    return false;
  }
  
  // Check for social auth options
  if (!providerContent.includes('options: ["google", "x", "email"]')) {
    console.log('❌ Social authentication options not configured');
    return false;
  }
  
  console.log('✅ Thirdweb provider is properly configured');
  return true;
}

// Check if the social auth component exists
function checkSocialAuthComponent() {
  console.log('\n🔐 Checking social authentication component...');
  
  const socialAuthPath = path.join(process.cwd(), 'components', 'thirdweb-social-auth.tsx');
  
  if (!fs.existsSync(socialAuthPath)) {
    console.log('❌ thirdweb-social-auth.tsx not found');
    return false;
  }
  
  const socialAuthContent = fs.readFileSync(socialAuthPath, 'utf8');
  
  // Check for required functionality
  const requiredFeatures = [
    'ConnectEmbed',
    'useActiveAccount',
    'socialWallet',
    'google',
    'x'
  ];
  
  const missingFeatures = [];
  for (const feature of requiredFeatures) {
    if (!socialAuthContent.includes(feature)) {
      missingFeatures.push(feature);
    }
  }
  
  if (missingFeatures.length > 0) {
    console.log('❌ Missing features in social auth component:');
    missingFeatures.forEach(feature => {
      console.log(`   - ${feature}`);
    });
    return false;
  }
  
  console.log('✅ Social authentication component is properly implemented');
  return true;
}

// Main test function
function runTests() {
  const tests = [
    checkEnvironmentVariables,
    checkThirdwebPackages,
    checkThirdwebProvider,
    checkSocialAuthComponent
  ];
  
  let passedTests = 0;
  
  for (const test of tests) {
    if (test()) {
      passedTests++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`   Passed: ${passedTests}/${tests.length}`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 All tests passed! Your thirdweb authentication setup looks good.');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your thirdweb client ID is valid');
    console.log('   2. Test the authentication flow in your app');
    console.log('   3. Check the thirdweb dashboard for any configuration issues');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above before testing authentication.');
  }
}

// Run the tests
runTests();
