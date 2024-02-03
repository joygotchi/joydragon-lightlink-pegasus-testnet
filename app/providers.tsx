"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";


import { Chain } from '@wagmi/core'
 
export const vicTestnet = {
  id: process.env.CHAIN_ID as any ,
  name: process.env.CHAIN_NAME  as string,
  network: process.env.CHAIN_NAME  as string,
  nativeCurrency: {
    decimals: 18,
    name: process.env.TOKEN as string,
    symbol: process.env.SYMBOL as string,
  },
  rpcUrls: {
    public: { http: [process.env.RPC as string] },
    default: { http: [process.env.RPC as string] },
  },
  blockExplorers: {
    etherscan: { name: 'ETHSCAN', url: process.env.EXPLORER_URL as string },
    default: { name: 'ETHSCAN', url: process.env.EXPLORER_URL as string  },
  },
} as const satisfies Chain

import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
  } from '@rainbow-me/rainbowkit';
  import {
	argentWallet,
	trustWallet,
	ledgerWallet,
  } from '@rainbow-me/rainbowkit/wallets';
  import { configureChains, createConfig, WagmiConfig } from 'wagmi';
  
  import { publicProvider  } from 'wagmi/providers/public';
  import { alchemyProvider } from 'wagmi/providers/alchemy';
  
  const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
		vicTestnet,
	  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [vicTestnet] : []),
	],
	[
		publicProvider(),
		alchemyProvider({ apiKey: "Df6rvkniZ98Rh9Dvhn-88PEfJkE9_Tgg" })
	]
  );
  
  const projectId = 'ea8370ab6881883427566262faaf8556';
  
  const { wallets } = getDefaultWallets({
	appName: 'JoyDragon',
	projectId,
	chains,
  });
  
  const demoAppInfo = {
	appName: 'JoyDragon',
  };
  
  const connectors = connectorsForWallets([
	...wallets,
	{
	  groupName: 'Other',
	  wallets: [
		argentWallet({ projectId, chains }),
		trustWallet({ projectId, chains }),
		ledgerWallet({ projectId, chains }),
	  ],
	},
  ]);
  
  const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
  });

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

	return (
		<WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
	  <NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
		</NextUIProvider>
		</RainbowKitProvider>
	  </WagmiConfig>
	 
	
	);
}
