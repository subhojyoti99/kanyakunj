import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

export const metadata = {
  title: "Kanyakunj – For Her From Her",
  description:
    "Elevate Your Everyday Style with Timeless Ethnic Wear. Shop Kurtis, Co-ord Sets, Dupattas & more.",
  keywords: "ethnic wear, kurti, dupatta, co-ord set, women fashion india",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
