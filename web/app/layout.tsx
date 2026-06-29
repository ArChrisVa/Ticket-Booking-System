import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "ticketbox — find your next event",
  description: "Book event tickets, powered by a microservices backend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <AuthModal />
        <footer className="footer">
          Demo storefront on a microservices backend · events · auth · booking · RabbitMQ
        </footer>
      </body>
    </html>
  );
}
