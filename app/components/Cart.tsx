'use client';

import React, { useState } from 'react';
import { Product } from '../page';

interface Props {
  cart: Product[];
  onClear: () => void;
}

const Cart: React.FC<Props> = ({ cart, onClear }) => {
  const [discount, setDiscount] = useState<string>('');
  const [showTicket, setShowTicket] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const discountValue = parseFloat(discount) || 0;
  const total = subtotal - discountValue;

  const handleConfirmPurchase = () => {
    if (cart.length === 0) return;

    const sale = {
      timestamp: new Date().toISOString(),
      items: cart,
      discount: discountValue,
      total,
    };

    const prev = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    localStorage.setItem('salesHistory', JSON.stringify([...prev, sale]));

    setShowTicket(true);
  };

  const handleFinish = () => {
    setShowTicket(false);
    onClear();
    setDiscount('');
  };

  if (showTicket) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mt-4 print:bg-white">
        <h2 className="text-xl font-bold text-center mb-2">Ticket</h2>
        <ul className="mb-2">
          {cart.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right text-sm text-gray-700">Descuento: ${discountValue.toFixed(2)}</div>
        <div className="text-right font-bold">Total: ${total.toFixed(2)}</div>
        <p className="text-center mt-4 text-sm italic text-gray-600">¡Gracias por su compra!</p>
        <div className="flex justify-end gap-2 mt-4 no-print">
          <button onClick={() => window.print()} className="bg-green-600 text-white px-3 py-1 rounded">
            Imprimir
          </button>
          <button onClick={handleFinish} className="bg-gray-500 text-white px-3 py-1 rounded">
            Finalizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="mb-2">
            {cart.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mb-2 text-right">Subtotal: ${subtotal.toFixed(2)}</div>
          <input
            type="number"
            placeholder="Descuento"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border p-1 rounded w-full mb-2"
          />
          <div className="text-right font-bold mb-2">Total: ${total.toFixed(2)}</div>
          <div className="flex justify-between">
            <button onClick={onClear} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
              Vaciar carrito
            </button>
            <button onClick={handleConfirmPurchase} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
              Confirmar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
