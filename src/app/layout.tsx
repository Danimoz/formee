import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { sfPro } from "./font";
import DndProviderWrapper from "@/components/providers/dndProvider";
import { FormProvider } from "@/context/form-context";
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Formee - Form Builder Dashboard',
  description: 'Create and manage your forms with ease',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* React Scan for development */}
      {process.env.NODE_ENV === "development" &&
        <head>
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      }
      <body
        className={`${sfPro.className} antialiased`}
      >
        <SessionProvider>
          <DndProviderWrapper>
            <FormProvider initialData={{
              title: "",
              description: "",
              sections: []
            }}>
              {children}
            </FormProvider>
          </DndProviderWrapper>
        </SessionProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
