import { Caveat, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import SiteChrome from "../components/layout/SiteChrome";
import { getCatalogue } from "../lib/server/products";
import { SITE_URL, STORE_FULL_NAME } from "../lib/config";

// Re-fetch the catalogue for server-rendered pages at most hourly; the client listener keeps it live after load.
export const revalidate = 3600;

// Montserrat for headings and body, Caveat for the handwritten accents, as in the design.
const sans = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans", display: "swap" });
const script = Caveat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-script", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${STORE_FULL_NAME} | Freshly Baked Goodness in Every Bite`, template: `%s | ${STORE_FULL_NAME}` },
  description: "Fresh, delicious cookies, cupcakes, doughnuts and pastries baked from scratch with premium ingredients and a whole lot of love.",
  openGraph: { siteName: STORE_FULL_NAME, type: "website" },
  icons: { icon: "/icon.svg" },
};

export const viewport = { themeColor: "#11573A" };

export default async function RootLayout({ children }) {
  const products = await getCatalogue();

  return (
    <html lang="en" className={`${sans.variable} ${script.variable}`}>
      <body>
        <Providers initialProducts={products}>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
