import "./globals.css";

export const metadata = {
  title: "SalonFlow",
  description: "Salon management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}