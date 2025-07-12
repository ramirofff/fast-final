'use client';

import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import QRCode from 'react-qr-code';

interface CartProps {
  cart: CartItem[];
  onClear: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onConfirm: (sale: {
    timestamp: string;
    items: Product[];
    total: number;
    discount: number;
  }) => void;
}

export default function Cart({ cart, onClear, onUpdateQuantity, onConfirm }: CartProps) {
  const [discount, setDiscount] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSimulatedQR, setShowSimulatedQR] = useState(false);
  const [simulatedCheckoutUrl, setSimulatedCheckoutUrl] = useState('');

  const numericDiscount = parseFloat(discount) || 0;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) - numericDiscount;

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount('');
      setShowReceipt(false);
      setShowSimulatedQR(false);
    }
  }, [cart]);

  const simulateStripePayment = () => {
    setSimulatedCheckoutUrl("https://fake-stripe-checkout.com/session/123456");
    setShowSimulatedQR(true);

    // Simular confirmación automática de pago después de 3 segundos
    setTimeout(() => {
      const sale = {
        timestamp: new Date().toISOString(),
        items: cart.flatMap(item =>
          Array(item.quantity).fill({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
          })
        ),
        total,
        discount: numericDiscount,
      };

      const salesHistory = JSON.parse(localStorage.getItem('salesHistory') || '[]');
      localStorage.setItem('salesHistory', JSON.stringify([...salesHistory, sale]));
      setShowReceipt(true);
      setShowSimulatedQR(false);
      onConfirm(sale);
      onClear(); // ✅ Vaciar carrito automáticamente luego del pago
    }, 3000);

  };

  const handlePrint = () => {
    window.print();
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
                    USD ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 0;
                        onUpdateQuantity(item.id, quantity);
                      }}
                      className="border rounded px-2 py-1 text-sm w-16"
                    />
                    <button
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="text-red-500 text-sm hover:text-red-700"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
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

          {!showReceipt && !showSimulatedQR && (
            <button
              onClick={simulateStripePayment}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm w-full"
            >
              Pagar con QR
            </button>
          )}

          {showSimulatedQR && (
            <div className="mt-4 space-y-2 text-center">
              <p className="text-sm">Escaneá este código con tu app de pagos:</p>
              <div className="mx-auto w-fit bg-white p-2 rounded shadow">
                <QRCode value={simulatedCheckoutUrl} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Esperando confirmación...</p>
            </div>
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
