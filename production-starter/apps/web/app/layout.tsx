import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "ProfessionalMining | Product Preview",
  description: "Digital asset portfolio education and product preview.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
