import '@rainbow-me/rainbowkit/styles.css';
import "../styles/nes.css/css/nes.css"
import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Silkscreen} from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { NavBottom } from "@/components/navbottom";
import { Link } from "@nextui-org/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import clsx from "clsx";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={`min-h-screen bg-background ${Silkscreen.className} antialiased`}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-7xl  flex-grow">
							{children}
						</main>
						
						<footer className="w-full flex items-center justify-center py-3">
						<NavBottom/>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
