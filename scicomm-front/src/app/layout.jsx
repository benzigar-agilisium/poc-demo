// Importing fonts
import "@fontsource-variable/dm-sans";

import "./globals.css";

import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Amgen - Scicomm",
  description: "Sharing files through QR-code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="lg:hidden fixed flex justify-center items-center inset-0 bg-zinc-100 z-50">
          <div className="flex flex-col text-center">
            <p className="text-2xl font-bold">
              Oops. Project is working fine, But
            </p>
            <p className="mt-2 max-w-[500px]">
              Mobile view is not supported yet. Please check this page in laptop
              or desktop browser.
            </p>
          </div>
        </div>
        <AuthProvider>
          {children}
          <Toaster
            toastOptions={{
              position: "bottom-right",
              success: {
                iconTheme: {
                  primary: "#0063C3",
                  secondary: "white",
                },
                className: "font-bold rounded-md text-sm",
                style: {
                  backgroundColor: "#EAF4FF",
                  borderRadius: 5,
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
