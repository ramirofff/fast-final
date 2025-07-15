export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-[#0f1728] text-white min-h-screen font-sans">
        <div className="flex min-h-screen w-full">
          <aside className="hidden lg:block w-[260px] bg-[#101b2d] border-r border-gray-800 shadow-inner p-4">
            {/* Podés meter aquí navegación vertical o branding */}
            <h1 className="text-xl font-bold text-green-500">🛒 POS Vendedor</h1>
            <nav className="mt-6 space-y-2">
              {/* íconos de navegación opcionales */}
              <button className="block w-full text-left px-2 py-1 rounded hover:bg-green-700/30">Inicio</button>
              <button className="block w-full text-left px-2 py-1 rounded hover:bg-green-700/30">Historial</button>
              <button className="block w-full text-left px-2 py-1 rounded hover:bg-green-700/30">Productos</button>
            </nav>
          </aside>

          <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
