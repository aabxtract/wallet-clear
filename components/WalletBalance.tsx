"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAccount, useBalance, useChainId } from "wagmi";
import { userSession, getStacksAddress } from "@/lib/stacks";

export default function WalletBalance() {
  const { isConnected: isEvmConnected, address: evmAddress } = useAccount();
  const chainId = useChainId();
  const { data: evmBalance } = useBalance({ address: evmAddress });
  const [stacksData, setStacksData] = useState<{ balance: string; tokens: any[] } | null>(null);
  const [loadingStacks, setLoadingStacks] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const address = getStacksAddress();
      if (address) {
        fetchStacksBalance(address);
      }
    }
  }, []);

  const fetchStacksBalance = async (address: string) => {
    setLoadingStacks(true);
    try {
      const response = await axios.get(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`);
      const { stx } = response.data;
      const formattedBalance = (parseInt(stx.balance) / 1000000).toFixed(2);
      
      // Tokens (Fungible tokens)
      const fungibleTokens = Object.entries(response.data.fungible_tokens || {}).map(([key, value]: [string, any]) => ({
        symbol: key.split("::")[2],
        balance: (parseInt(value.balance) / Math.pow(10, value.decimals || 0)).toFixed(2),
        id: key
      }));

      setStacksData({
        balance: formattedBalance,
        tokens: fungibleTokens
      });
    } catch (error) {
      console.error("Error fetching Stacks balance:", error);
    } finally {
      setLoadingStacks(false);
    }
  };

  if (!isEvmConnected && !userSession.isUserSignedIn()) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {/* EVM Balance */}
      {isEvmConnected && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider">EVM Wallet</h3>
            <span className="text-xs bg-[#627EEA]/20 text-[#627EEA] px-2 py-1 rounded-md font-bold">L1/L2</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">
              {evmBalance?.formatted.slice(0, 8)} {evmBalance?.symbol}
            </span>
            <span className="text-xs text-[#555] mt-1 break-all">{evmAddress}</span>
          </div>
          
          <div className="mt-4 border-t border-[#222] pt-4">
            <h4 className="text-xs font-semibold text-[#888] uppercase mb-3">Native Token</h4>
            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-[#ccc]">{evmBalance?.symbol}</span>
              <span className="text-white font-medium">{evmBalance?.formatted.slice(0, 8)}</span>
            </div>
            <p className="text-[10px] text-[#444] mt-4 flex items-center justify-center italic">
              * Connect specialized wallet explorer to see ERC-20 tokens
            </p>
          </div>
        </div>
      )}

      {/* Stacks Balance */}
      {userSession.isUserSignedIn() && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#888] uppercase tracking-wider">Stacks Wallet</h3>
            <span className="text-xs bg-[#5546FF]/20 text-[#5546FF] px-2 py-1 rounded-md font-bold">STX</span>
          </div>
          <div className="flex flex-col">
            {loadingStacks ? (
              <span className="text-xl font-bold text-white">Loading...</span>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">
                  {stacksData?.balance || "0.00"} STX
                </span>
                <span className="text-xs text-[#555] mt-1 break-all">{getStacksAddress()}</span>
              </>
            )}
          </div>

          <div className="mt-4 border-t border-[#222] pt-4">
            <h4 className="text-xs font-semibold text-[#888] uppercase mb-3">Fungible Tokens</h4>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[120px] pr-2 custom-scrollbar">
              {stacksData?.tokens && stacksData.tokens.length > 0 ? (
                stacksData.tokens.map((token, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-[#222]/50 last:border-0">
                    <span className="text-[#ccc]">{token.symbol}</span>
                    <span className="text-white font-medium">{token.balance}</span>
                  </div>
                ))
              ) : (
                <span className="text-[#444] text-xs italic">No additional tokens found</span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
