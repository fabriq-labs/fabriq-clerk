import { ClerkProvider, ClerkLoaded } from "@clerk/nextjs";

import { AI } from "./action";

import "./globals.css";
import "@/styles/scss/index.scss";

import "react-datepicker/dist/react-datepicker.css";

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
          <title>Fabriq</title>
        </head>
        <body>
          <ClerkLoaded>
            {" "}
            <AI>{children}</AI>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
