// components/Header.tsx
'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  storeName: string;
  setStoreName: (name: string) => void;
  confirmedStoreName: string;
  setConfirmedStoreName: (name: string) => void;
}

const Header: React.FC<Props> = ({
  storeName,
  setStoreName,
  confirmedStoreName,
  setConfirmedStoreName,
}) => {
  return (
    <header className="text-center bg-gray-900 text-white rounded-2xl shadow p-6 mb-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow mb-2">
        Administración de Ventas
      </h1>

      {!confirmedStoreName ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Nombre del local"
            className="w-64 px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => setConfirmedStoreName(storeName)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
          >
            <CheckCircle size={18} />
            Confirmar
          </button>
        </div>
      ) : (
        <h2 className="text-xl sm:text-2xl font-semibold text-green-400 mt-3">
          {confirmedStoreName}
        </h2>
      )}
    </header>
  );
};

export default Header;
