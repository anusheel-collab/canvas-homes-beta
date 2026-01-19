// app/layout.tsx
import "./globals.css";
import { Manrope } from "next/font/google";
import { MapsProvider } from "./components/common/DeepSearch/MapsContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.className}>
      <body>
        <MapsProvider>{children}</MapsProvider>
      </body>
    </html>
  );
}
