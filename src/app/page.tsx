import Link from "next/link";
import { MagicLoginButton } from "@/components/MagicLoginButton";
import { FaRobot } from "react-icons/fa";
import { IoGlobeOutline, IoFlash } from "react-icons/io5";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">Chainless Checkout AI</span>
        </div>
        <MagicLoginButton />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-2xl text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Sell digital products with one prompt.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Let buyers pay from any chain. Settle and deliver on Arbitrum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/merchant/create"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-foreground text-background px-8 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create a Checkout
            </Link>

          </div>
        </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
            <div className="rounded-lg border p-6 text-center space-y-2">
              <FaRobot className="text-2xl mx-auto text-muted-foreground" />
              <h3 className="font-semibold">AI creates your checkout</h3>
              <p className="text-sm text-muted-foreground">
                Describe what you want to sell. AI generates the page, metadata,
                and gated content.
              </p>
            </div>
            <div className="rounded-lg border p-6 text-center space-y-2">
              <IoGlobeOutline className="text-2xl mx-auto text-muted-foreground" />
              <h3 className="font-semibold">
                Particle UA handles payments
              </h3>
              <p className="text-sm text-muted-foreground">
                Buyers pay from any chain. One balance, no bridging, no network
                switching.
              </p>
            </div>
            <div className="rounded-lg border p-6 text-center space-y-2">
              <IoFlash className="text-2xl mx-auto text-muted-foreground" />
              <h3 className="font-semibold">Arbitrum delivers</h3>
              <p className="text-sm text-muted-foreground">
                Settlement and NFT access passes minted on Arbitrum Sepolia.
              </p>
            </div>
          </div>
      </main>

      <footer className="p-4 text-center text-xs text-muted-foreground">
        Powered by Particle Universal Accounts, Magic, and Arbitrum
      </footer>
    </div>
  );
}
