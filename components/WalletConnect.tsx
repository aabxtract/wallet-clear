"use client";

import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { showConnect, authenticate } from "@stacks/connect";
import { userSession, getStacksAddress } from "@/lib/stacks";
import { useAccount, useDisconnect } from "wagmi";

export default function WalletConnect() {
  const { isConnected: isEvmConnected, address: evmAddress } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const [isStacksConnected, setIsStacksConnected] = useState(false);
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsStacksConnected(true);
      setStacksAddress(getStacksAddress());
    }
  }, []);

  const connectStacks = () => {
    showConnect({
      appDetails: {
        name: "WalletClear",
        icon: "/favicon.svg",
      },
      redirectTo: "/",
      onFinish: () => {
        setIsStacksConnected(true);
        setStacksAddress(getStacksAddress());
      },
      userSession,
    });
  };

  const disconnectStacks = () => {
    userSession.signUserOut();
    setIsStacksConnected(false);
    setStacksAddress(null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {/* EVM Connection (RainbowKit) */}
      <ConnectButton
        label="Connect EVM Wallet"
        accountStatus="address"
        chainStatus="icon"
        showBalance={false}
      />

      {/* Stacks Connection */}
      {!isStacksConnected ? (
        <button
          onClick={connectStacks}
          className="px-4 py-2.5 bg-[#5546FF] hover:bg-[#4436EE] text-white font-medium rounded-xl transition-all h-[42px] flex items-center justify-center min-w-[180px]"
        >
          <span className="mr-2">ⓢ</span> Connect Stacks
        </button>
      ) : (
        <button
          onClick={disconnectStacks}
          className="px-4 py-2.5 bg-[#1a1a1a] border border-[#333] hover:border-[#444] text-[#ccc] font-medium rounded-xl transition-all h-[42px] flex items-center justify-center min-w-[180px]"
        >
          <span className="mr-2">ⓢ</span> {stacksAddress?.slice(0, 6)}...{stacksAddress?.slice(-4)}
        </button>
      )}
    </div>
  );
}
