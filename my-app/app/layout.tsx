// app/layout.tsx
import "./globals.css";
import { MapsProvider } from "./components/common/DeepSearch/MapsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MapsProvider>{children}</MapsProvider>
      </body>
    </html>
  );
}
