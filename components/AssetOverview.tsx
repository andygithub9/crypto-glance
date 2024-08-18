// components/AssetOverview.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance, useContractReads } from "wagmi";
import { formatEther } from "viem";
import { erc20Abi } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TOKENS = [
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as `0x${string}`,
    priceKey: "ethereum",
  },
  {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`,
    priceKey: "usd-coin",
  },
  {
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as `0x${string}`,
    priceKey: "wrapped-bitcoin",
  },
];

interface TokenBalance {
  symbol: string;
  balance: bigint;
  usdValue: number;
}

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

const AssetOverview = () => {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [prices, setPrices] = useState<PriceData>({});

  const { data: tokenData } = useContractReads({
    contracts: TOKENS.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address!],
    })),
  });

  useEffect(() => {
    setMounted(true);
    const fetchPrices = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${TOKENS.map(
          (t) => t.priceKey
        ).join(",")}&vs_currencies=usd`
      );
      const data: PriceData = await response.json();
      setPrices(data);
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (tokenData) {
      setTokenBalances(
        TOKENS.map((token, index) => {
          const balance = tokenData[index]?.result
            ? BigInt(tokenData[index].result.toString())
            : 0n;
          return {
            symbol: token.symbol,
            balance,
            usdValue:
              Number(formatEther(balance)) * (prices[token.priceKey]?.usd || 0),
          };
        })
      );
    }
  }, [tokenData, prices]);

  if (!mounted) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
      </CardHeader>
      <CardContent>
        {address ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>ETH</TableCell>
                <TableCell>{ethBalance?.formatted} ETH</TableCell>
                <TableCell>
                  $
                  {(
                    Number(ethBalance?.formatted) *
                    (prices["ethereum"]?.usd || 0)
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
              {tokenBalances.map((token) => (
                <TableRow key={token.symbol}>
                  <TableCell>{token.symbol}</TableCell>
                  <TableCell>
                    {formatEther(token.balance)} {token.symbol}
                  </TableCell>
                  <TableCell>${token.usdValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Please connect your wallet to view assets.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetOverview;
