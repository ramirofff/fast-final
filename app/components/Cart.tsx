'use client';

import { Product, Sale } from '../page';
import { useEffect, useState } from 'react';

interface CartProps {
  cart: Product[];
  onClear: () => void;
  onConfirm?: (sale: Sale) => void;
}

export default function Cart({ cart, onClear, onConfirm }: CartProps) {
  const [discount, setDiscount] = useState<string>('');

  const numericDiscount = parseFloat(discount) || 0;
  const total = cart.reduce((sum, item) => sum + item.price, 0) - numericDiscount;

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount('');
    }
  }, [cart]);

  const handleCheckout = () => {
    const sale: Sale = {
      timestamp: new Date().toISOString(),
      items: cart,
      total,
      discount: numericDiscount,
    };

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    localStorage.setItem('salesHistory', JSON.stringify([...salesHistory, sale]));

    if (onConfirm) onConfirm(sale); // ✅ muestra el ticket directamente
    onClear(); // ✅ vacía el carrito después de la compra
  };

  return (
    <div className="flex flex-col gap-2 max-w-[260px] w-full">
      <h3 className="text-lg font-bold mb-2">Carrito</h3>

      {cart.length === 0 ? (
        <p className="text-sm">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cart.map((item, index) => (
              <li key={index} className="flex items-center gap-2 border-b pb-1">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-green-600 font-semibold text-sm">
                    USD ${item.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-2">
            <label className="block text-xs">Descuento:</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
              placeholder="Ingrese descuento manual"
            />
          </div>

          <div className="mt-2 text-sm">
            <strong>Total:</strong> USD ${total.toFixed(2)}
          </div>

          <button
            onClick={handleCheckout}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
          >
            Confirmar compra
          </button>

          <button
            onClick={onClear}
            className="mt-2 bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm w-full"
          >
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
