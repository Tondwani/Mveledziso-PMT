import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../provider/CurrentUserProvider";
import { ProjectProvider } from "../provider/ProjectManagement";
import { TeamProvider } from "../provider/TeamManagement";
import { MilestoneProvider } from "../provider/MilestoneManagement";
import { NotificationProvider } from "../provider/NotificationManagement";

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
  title: "Mveledziso - Project Management System",
  description: "Phanda nga Tshumelo - Empowering teams with intelligent project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <TeamProvider>
            <ProjectProvider>
              <MilestoneProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </MilestoneProvider>
            </ProjectProvider>
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
