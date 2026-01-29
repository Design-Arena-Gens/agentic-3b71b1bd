import "./globals.css";

export const metadata = {
  title: "Can I Upload a Pic Here?",
  description:
    "Drag-and-drop interface that explains how image uploads work in this chat."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
