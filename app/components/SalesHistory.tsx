'use client';

import React, { useEffect, useState } from 'react';
import { Sale } from '../types'; // ✅ import correcto

interface SalesHistoryProps {
  salesToday: Sale[]; // opcional, ya no se usa
  totalToday: number; // opcional, ya no se usa
  onBack: () => void;
  onClear: () => void;
  onViewTicket: (sale: Sale) => void;
  localName: string;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({
  onBack,
  onClear,
  onViewTicket,
  localName,
}) => {
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    const storedSales: Sale[] = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    setAllSales(storedSales);

    const uniqueDates = Array.from(
      new Set(storedSales.map(sale => sale.timestamp.split('T')[0]))
    ).sort().reverse();

    setAvailableDates(uniqueDates);

    if (uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]); // por defecto: el día más reciente
    }
  }, []);

  const salesForSelectedDate = allSales.filter(sale =>
    sale.timestamp.startsWith(selectedDate)
  );

  const totalForSelectedDate = salesForSelectedDate.reduce((sum, sale) => sum + sale.total, 0);

  const currentMonth = new Date().toISOString().slice(0, 7); // "2025-07"
  const salesThisMonth = allSales.filter(sale =>
    sale.timestamp.startsWith(currentMonth)
  );
  const totalThisMonth = salesThisMonth.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
        Administración de Ventas
      </h2>
      <h3 className="text-lg font-semibold text-center mb-4">
        {localName}
      </h3>

      <div className="mb-4">
        <label className="block font-medium mb-1">Seleccionar día:</label>
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          {availableDates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <h4 className="text-xl font-bold mb-4 text-center">
        Ventas del {new Date(selectedDate).toLocaleDateString()}
      </h4>

      {salesForSelectedDate.length === 0 ? (
        <p className="text-center">No hay ventas registradas ese día.</p>
      ) : (
        <div className="space-y-2">
          {salesForSelectedDate.map((sale, index) => (
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

      <div className="mt-6 text-right text-sm">
        <p><strong>Total vendido en el día:</strong> ${totalForSelectedDate.toFixed(2)}</p>
        <p className="mt-1 text-gray-600">
          <strong>Total vendido en el mes:</strong> ${totalThisMonth.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
          Volver
        </button>
        <button
          onClick={() => {
            if (confirm('¿Estás seguro de borrar todo el historial de ventas?')) {
              onClear();
              setAllSales([]);
              setAvailableDates([]);
              setSelectedDate('');
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Borrar historial
        </button>
      </div>
    </div>
  );
};

export default SalesHistory;
