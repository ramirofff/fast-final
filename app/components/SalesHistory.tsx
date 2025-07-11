import React from 'react';
import { Sale } from '../page'; // o desde tu archivo de tipos

interface SalesHistoryProps {
  salesToday: Sale[];
  totalToday: number;
  onBack: () => void;
  onClear: () => void;
  onViewTicket: (sale: Sale) => void;
  localName: string;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({
  salesToday,
  totalToday,
  onBack,
  onClear,
  onViewTicket,
  localName,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
        Administración de Ventas
      </h2>
      <h3 className="text-lg font-semibold text-center mb-4">
        {localName}
      </h3>

      <h4 className="text-xl font-bold mb-4 text-center">Historial de ventas del día</h4>

      {salesToday.length === 0 ? (
        <p className="text-center">No hay ventas registradas hoy.</p>
      ) : (
        <div className="space-y-2">
          {salesToday.map((sale, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                {new Date(sale.timestamp).toLocaleTimeString()} -{' '}
                <span className="ml-2">Total: ${sale.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onViewTicket(sale)}
                className="text-blue-600 underline text-sm hover:text-blue-800"
              >
                Ver ticket
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-right">
        <strong>Total vendido hoy:</strong> ${totalToday.toFixed(2)}
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
          Volver
        </button>
        <button onClick={onClear} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Borrar historial
        </button>
      </div>
    </div>
  );
};

export default SalesHistory;
