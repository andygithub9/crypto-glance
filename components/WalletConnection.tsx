// components/WalletConnection.tsx
"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const WalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  if (!mounted) return null;

  if (isConnected && address) {
    return (
      <div className="space-y-2">
        <p>Connected to {address}</p>
        <Button onClick={handleDisconnect}>Disconnect</Button>
      </div>
    );
  }

  return <Button onClick={() => open()}>Connect Wallet</Button>;
};

export default WalletConnection;
