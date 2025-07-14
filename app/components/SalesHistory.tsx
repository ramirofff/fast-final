'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sale } from '../types';

interface SalesHistoryProps {
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
    const fetchSales = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar historial de ventas:', error);
      } else if (data) {
        setAllSales(data);
        const uniqueDates = Array.from(
          new Set(data.map(sale => sale.created_at.split('T')[0]))
        ).sort().reverse();

        setAvailableDates(uniqueDates);
        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }
      }
    };

    fetchSales();
  }, []);

  const salesForSelectedDate = allSales.filter(sale =>
    sale.created_at.startsWith(selectedDate)
  );

  const totalForSelectedDate = salesForSelectedDate.reduce((sum, sale) => sum + sale.total, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const salesThisMonth = allSales.filter(sale =>
    sale.created_at.startsWith(currentMonth)
  );
  const totalThisMonth = salesThisMonth.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-400 mb-2">
        Administración de Ventas
      </h2>
      <h3 className="text-lg font-medium text-center mb-4">{localName}</h3>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-sm">Seleccionar día:</label>
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border rounded px-3 py-2 w-full bg-gray-800 text-white"
        >
          {availableDates.map(date => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <h4 className="text-lg font-semibold mb-4 text-center">
        Ventas del {new Date(selectedDate).toLocaleDateString()}
      </h4>

      {salesForSelectedDate.length === 0 ? (
        <p className="text-center text-gray-400">No hay ventas registradas ese día.</p>
      ) : (
        <div className="space-y-2">
          {salesForSelectedDate.map((sale, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
              <div className="text-sm">
                {new Date(sale.created_at).toLocaleTimeString()} -{' '}
                <span className="ml-2">Total: ${sale.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => onViewTicket(sale)}
                className="text-blue-400 underline text-sm hover:text-blue-300"
              >
                Ver ticket
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-right text-sm space-y-1">
        <p><strong>Total del día:</strong> ${totalForSelectedDate.toFixed(2)}</p>
        <p className="text-gray-300">
          <strong>Total del mes:</strong> ${totalThisMonth.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver
        </button>
        <button
          onClick={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (confirm('¿Estás seguro de borrar todo el historial de ventas?')) {
              const { error } = await supabase.from('sales').delete().eq('user_id', user.id);
              if (error) {
                alert('Error al borrar historial');
              } else {
                onClear();
                setAllSales([]);
                setAvailableDates([]);
                setSelectedDate('');
              }
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Borrar historial
        </button>
      </div>
    </div>
  );
};

export default SalesHistory;