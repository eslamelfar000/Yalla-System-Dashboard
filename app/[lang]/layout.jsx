import "../assets/scss/globals.scss";
import "../assets/scss/theme.scss";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import AuthProvider from "@/provider/auth.provider";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import { AuthProvider as CustomAuth } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/yallalogo.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <CustomAuth>
            <TanstackProvider>
              <Providers>
                <DirectionProvider lang={lang}>{children}</DirectionProvider>
              </Providers>
            </TanstackProvider>
          </CustomAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
