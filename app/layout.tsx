import '../styles/globals.css';

export const metadata = {
  title: 'Gestion de ventas v1',
  description: 'Sistema de ventas rápidas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* 🟢 Soporte PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
        <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 py-6 lg:pr-[260px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
