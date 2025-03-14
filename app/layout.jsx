import "/styles/globals.css";
import { Home } from "lucide-react";

export const metadata = {
  title: "Recipe Finder",
  description: "Find and explore delicious recipes with ease.",
};

export const viewport = {
  themeColor: "#ffffff", // Opcional: color del tema
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-400">
              Recipe Finder
            </h1>
            <nav>
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Home color="black" />
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-white border-t">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Recipe Finder App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
