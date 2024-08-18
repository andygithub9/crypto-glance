// lib/web3Config.ts
import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "You need to provide a NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable"
  );
}

const metadata = {
  name: "CryptoGlance",
  description: "A Web3 asset management tool",
  url: "https://yourwebsite.com", // 替換為你的網站 URL
  icons: ["https://avatars.githubusercontent.com/u/37784886"], // 替換為你的圖標 URL
};

// 使用 as const 來創建一個只讀的 chains 數組
export const chains = [mainnet, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
