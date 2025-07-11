'use client';

import { Product } from '../page';
import { useEffect, useState } from 'react';

interface CartProps {
  cart: Product[];
  onClear: () => void;
}

export default function Cart({ cart, onClear }: CartProps) {
  const [discount, setDiscount] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0) - discount;

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount(0);
      setShowReceipt(false);
    }
  }, [cart]);

  const handleCheckout = () => {
    const sale = {
      timestamp: new Date().toISOString(),
      items: cart,
      total,
      discount,
    };

    const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    localStorage.setItem('salesHistory', JSON.stringify([...salesHistory, sale]));
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Carrito</h3>
      {cart.length === 0 ? (
        <p className="text-sm">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <label className="block text-xs">Descuento:</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
              className="border rounded px-2 py-1 text-sm w-full"
              placeholder="Ingrese descuento manual"
            />
          </div>
          <div className="mt-2 text-sm">
            <strong>Total:</strong> ${total.toFixed(2)}
          </div>
          {!showReceipt && (
            <button
              onClick={handleCheckout}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
            >
              Confirmar compra
            </button>
          )}
          
          {showReceipt && (
            <button
              onClick={handlePrint}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
            >
              Imprimir ticket
            </button>
          )}
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
