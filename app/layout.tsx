// Paso 1: Asegurar que el layout permita al contenido principal expandirse bien
// Abre tu archivo layout.tsx y reemplaza todo con esto:

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex w-full">
          <main className="flex-1 px-4 lg:pr-[260px]"> {/* Espacio a la derecha para el carrito */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
