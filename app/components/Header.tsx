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
    <header className="text-center bg-[#0b1728] text-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-700 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-sm mb-2 tracking-wide">
        Administración de Ventas
      </h1>

      {!confirmedStoreName ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Nombre del local"
            className="w-64 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <button
            onClick={() => {
              if (storeName.trim() !== '') {
                setConfirmedStoreName(storeName);
                localStorage.setItem('confirmedStoreName', storeName);
              }
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-all"
          >
            <CheckCircle size={18} className="animate-pulse" />
            Confirmar
          </button>
        </div>
      ) : (
        <h2 className="text-xl sm:text-2xl font-semibold text-green-400 mt-4 tracking-wide">
          {confirmedStoreName}
        </h2>
      )}
    </header>
  );
};

export default Header;
