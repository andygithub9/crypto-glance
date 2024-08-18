// providers.tsx
"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, useAccount } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { useEffect } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.error(
    "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set in the environment variables."
  );
  throw new Error(
    "You need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable. Please check your .env.local file or environment settings."
  );
}

const metadata = {
  name: "CryptoGlance",
  description: "A Web3 asset management tool",
  url: "https://yourwebsite.com", // 替換為你的網站 URL
  icons: ["https://avatars.githubusercontent.com/u/37784886"], // 替換為你的圖標 URL
};

const chains = [mainnet, sepolia] as const;

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  // 移除 chains 參數
});

const queryClient = new QueryClient();

function ConnectionListener() {
  const { isConnected } = useAccount();

  useEffect(() => {
    console.log("Connection status changed:", isConnected);
  }, [isConnected]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectionListener />
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
