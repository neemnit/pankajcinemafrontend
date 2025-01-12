import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
import { ThemeProvider } from "./context/UserContext";
import BackgroundManager from "./Components/BackgroundManager";
import { ToastContainer } from "react-toastify";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pankaj Cinema Hall",
  description: "Online Booking App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="relative min-h-screen">
            {/* Background image */}
            <BackgroundManager />

            {/* Header - Fixed to the top */}
            <div className="fixed top-0 left-0 w-full z-20">
              <Header />
            </div>

            {/* Main content */}
            <div className="relative z-10 pt-[80px]">
              {/* Adding padding-top to ensure content doesn't overlap with the fixed header */}
              {children}
            </div>
          </div>
          {/* ToastContainer */}
        <ToastContainer position="top-right" autoClose={2000} />
        </ThemeProvider>
      </body>
    </html>
  );
}