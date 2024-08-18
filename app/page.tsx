// app/page.tsx
import WalletConnection from "@/components/WalletConnection";
import AssetOverview from "@/components/AssetOverview";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to CryptoGlance</h1>
      <WalletConnection />
      <AssetOverview />
    </main>
  );
}
