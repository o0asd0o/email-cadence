import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Cadence",
  description: "Email cadence workflow manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "1rem",
        }}
      >
        <nav
          style={{
            marginBottom: "1.5rem",
            borderBottom: "1px solid #ddd",
            paddingBottom: "0.5rem",
          }}
        >
          <a href="/" style={{ marginRight: "1rem" }}>
            Home
          </a>
          <a href="/cadences" style={{ marginRight: "1rem" }}>
            Cadences
          </a>
          <a href="/enrollments">Enrollments</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
