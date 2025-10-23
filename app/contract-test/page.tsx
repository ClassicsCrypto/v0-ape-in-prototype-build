import { ManagedAccountFactory } from "@/components/managed-account-factory"
import { WalletConnection } from "@/components/wallet-connection"
import { ContractConfigChecker } from "@/components/contract-config-checker"

export default function ContractTestPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contract Integration Test</h1>
          <p className="text-muted-foreground">
            Test your Managed Account Factory contract integration
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto">
          <WalletConnection />
        </div>

        {/* Contract Configuration Checker */}
        <ContractConfigChecker />

        {/* Contract Interface */}
        <ManagedAccountFactory />
      </div>
    </div>
  )
}
