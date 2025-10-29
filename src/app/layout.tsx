import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { AppointmentProvider } from "./contexts/AppointmentContext";
import GoogleOAuthProvider from "./components/GoogleOAuthProvider";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arogya Healthcare - Patient Management System",
  description: "Comprehensive patient management system for Arogya Healthcare Center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <AuthProvider>
          <GoogleOAuthProvider>
            <AppointmentProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </AppointmentProvider>
          </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}