import '../styles/globals.css';

export const metadata = {
  title: 'Fast Final POS',
  description: 'Sistema de ventas para vendedores móviles',
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
      <body className="bg-gray-50 min-h-screen">
        <div className="flex w-full">
          <main className="flex-1 px-4 lg:pr-[260px]"> {/* Espacio para carrito */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
