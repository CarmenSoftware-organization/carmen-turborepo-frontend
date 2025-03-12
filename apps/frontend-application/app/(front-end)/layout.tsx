import React from "react";
import { LanguageProvider } from "@inlang/paraglide-next";
import { languageTag } from "@/paraglide/runtime.js";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../context/AuthContext";
import { FontConfigProvider } from "@/components/provider/FontConfigProvider";
// import NextTopLoader from 'nextjs-toploader';

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Carmen Inventory",
	description: "Carmen Inventory",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<LanguageProvider>
			<html lang={languageTag()}>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<AuthProvider>
							<FontConfigProvider>
								{/* <NextTopLoader color="hsl(var(--primary))" /> */}
								{children}
							</FontConfigProvider>
						</AuthProvider>
					</ThemeProvider>
					<Toaster />
				</body>
			</html>
		</LanguageProvider>
	);
}
