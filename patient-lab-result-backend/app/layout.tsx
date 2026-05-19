import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Portal API",
  description: "Backend API for patient lab results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}