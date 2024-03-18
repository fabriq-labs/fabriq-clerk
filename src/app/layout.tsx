import { ClerkProvider, ClerkLoaded } from "@clerk/nextjs";

import "./globals.css";
import "@/styles/scss/index.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {" "}
          <title>Nigo</title>
        </head>
        <body>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
