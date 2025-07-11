// components/Header.tsx
import React from 'react';

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
  <div>
    <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-800">Administración de Ventas</h1>

    {!confirmedStoreName ? (
      <div className="mb-4 flex gap-2 items-center justify-center">
        <input
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="border p-2 rounded shadow w-full max-w-xs"
          placeholder="Nombre del local"
        />
        <button
          onClick={() => setConfirmedStoreName(storeName)}
          className="bg-green-500 text-white px-3 py-2 rounded shadow"
        >
          ✓
        </button>
      </div>
    ) : (
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">{confirmedStoreName}</h2>
    )}
  </div>
);

export default Header;
