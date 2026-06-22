import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEYMOVIE — Admin",
  description: "HEYMOVIE Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-0.5 font-black text-lg tracking-tight">
                <span className="text-red-500">HEY</span>
                <span className="text-white">MOVIE</span>
              </Link>

              <nav className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
                <Link href="/" className="transition-colors hover:text-white">
                  Нүүр
                </Link>
                <Link href="/allUserGet" className="transition-colors hover:text-white">
                  Хэрэглэгчид
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white">
                      Нэвтрэх
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500">
                      Бүртгүүлэх
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
