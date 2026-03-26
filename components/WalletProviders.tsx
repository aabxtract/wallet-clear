"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
} from "wagmi/chains";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

// Configure Wagmi via RainbowKit
const config = getDefaultConfig({
  appName: "WalletClear",
  projectId: "ff696238b93568c07c1348be88b5b54a", // Public sample projectId
  chains: [mainnet, polygon, bsc, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#627EEA",
            accentColorForeground: "white",
            borderRadius: "large",
          })}
        >
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
