// components/Header.tsx
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
}) => (
  <div className="text-center mb-6">
    <h1 className="text-4xl font-extrabold text-blue-800 mb-2 drop-shadow-sm">Administración de Ventas</h1>

    {!confirmedStoreName ? (
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center mt-4">
        <input
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 w-64 text-center"
          placeholder="Nombre del local"
        />
        <button
          onClick={() => setConfirmedStoreName(storeName)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
        >
          <CheckCircle size={18} />
          Confirmar
        </button>
      </div>
    ) : (
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">{confirmedStoreName}</h2>
    )}
  </div>
);

export default Header;
