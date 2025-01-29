import type { Metadata } from "next";
import {ReactNode} from "react"
import "./globals.css";
import localFont from 'next/font/local';
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


const ibmPlexSans = localFont({
  src: [
      {path: '/fonts/IBMPlexSans-Regular.ttf', weight: '400', style: 'normal'},
      {path: '/fonts/IBMPlexSans-Medium.ttf', weight: '500', style: 'normal'},
      {path: '/fonts/IBMPlexSans-SemiBold.ttf', weight: '600', style: 'normal'},
      {path: '/fonts/IBMPlexSans-Bold.ttf', weight: '700', style: 'normal'},
  ]
});

const babasNeue= localFont({
  src: [
      {path: '/fonts/BebasNeue-Regular.ttf', weight: '400', style: 'normal'}
  ],
    variable: '--babas-neue'
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "BookWise is a book borrowing university management solution.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${ibmPlexSans.className} ${babasNeue.variable} antialiased`}
        >
          {children}

          <Toaster />
        </body>
      </SessionProvider>
    
    </html>
  );
}
