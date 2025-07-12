'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import QRCode from 'react-qr-code';
import CartItemRow from './CartItemRow';

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const paymentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    };
  }, []);

  const simulateStripePayment = () => {
    setSimulatedCheckoutUrl("https://fake-stripe-checkout.com/session/123456");
    setShowSimulatedQR(true);
    setIsProcessingPayment(true);

    paymentTimeoutRef.current = setTimeout(() => {
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
      setIsProcessingPayment(false);
      onConfirm(sale);
      onClear();
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
            {cart.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
              />
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
              disabled={isProcessingPayment}
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
            disabled={isProcessingPayment}
          >
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
