'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import QRCode from 'react-qr-code';
import CartItemRow from './CartItemRow';
import { PercentCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface CartProps {
  cart: CartItem[];
  onClear: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onConfirm: (sale: {
    id: string;
    created_at: string;
    items: Product[];
    total: number;
    discount: number;
    user_id: string;
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
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) - numericDiscount;

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount('');
      setShowReceipt(false);
      setShowSimulatedQR(false);
      setIsProcessingPayment(false);
    }
  }, [cart]);

  useEffect(() => {
    return () => {
      if (paymentTimeoutRef.current) {
        clearTimeout(paymentTimeoutRef.current);
      }
    };
  }, []);

  const simulateStripePayment = async () => {
    if (isProcessingPayment || total <= 0) return;

    setSimulatedCheckoutUrl('https://fake-stripe-checkout.com/session/123456');
    setShowSimulatedQR(true);
    setIsProcessingPayment(true);

    paymentTimeoutRef.current = setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Usuario no autenticado');
        setIsProcessingPayment(false);
        return;
      }

      const saleItems: Product[] = cart.flatMap(item =>
        Array(item.quantity).fill({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
        })
      );

      const { data: inserted, error } = await supabase
        .from('sales')
        .insert({
          user_id: user.id,
          items: saleItems,
          total,
          discount: numericDiscount,
        })
        .select()
        .single();

      if (error || !inserted) {
        alert('Error al guardar la venta: ' + (error?.message || 'Sin datos'));
        setIsProcessingPayment(false);
        return;
      }

      setShowReceipt(true);
      setShowSimulatedQR(false);
      setIsProcessingPayment(false);
      onConfirm(inserted); // ✅ Pasamos la venta insertada con ID y timestamp
      onClear();
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 max-w-[320px] w-full text-white bg-gradient-to-br from-[#1a1f3c] to-[#0b1728] p-6 rounded-3xl shadow-2xl animate-fade-in border-2 border-blue-500/20">
      <h3 className="text-lg font-bold mb-1 border-b pb-1 border-gray-600">Carrito</h3>

      {cart.length === 0 ? (
        <p className="text-sm text-gray-300">No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cart.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </ul>

          <div className="mt-2 relative">
            <label className="text-xs text-gray-300 mb-1 flex items-center gap-1">
              <PercentCircle size={14} className="text-yellow-400" /> Descuento:
            </label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-[#0b1728] text-white border-2 border-blue-500/20 rounded-xl shadow-lg focus:outline-none focus:border-blue-500/40 transition-all duration-300"
              placeholder="Ingrese descuento manual"
            />
          </div>

          <div className="mt-2 text-sm font-semibold">
            Total:{' '}
            <span className={`font-bold ${total <= 0 ? 'text-red-400' : 'text-green-400'}`}>
              USD ${total.toFixed(2)}
            </span>
          </div>

          {!showReceipt && !showSimulatedQR && (
            <button
              onClick={simulateStripePayment}
              className={`mt-4 text-white px-4 py-3 rounded-xl text-sm w-full transition-all duration-300 font-semibold shadow-lg ${
                total <= 0 ? 'bg-gray-500/50 cursor-not-allowed border-2 border-gray-600/20' : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-2 border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20'
              }`}
              disabled={isProcessingPayment || total <= 0}
            >
              {total <= 0 ? 'Total inválido' : 'Pagar con QR'}
            </button>
          )}

          {showSimulatedQR && (
            <div className="mt-4 space-y-2 text-center">
              <p className="text-sm">Escaneá este código con tu app de pagos:</p>
              <div className="mx-auto w-fit bg-white p-2 rounded shadow">
                <QRCode value={simulatedCheckoutUrl} />
              </div>
              <p className="text-xs text-gray-400 mt-2">Esperando confirmación...</p>
            </div>
          )}

          {showReceipt && (
            <button
              onClick={handlePrint}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-3 rounded-xl text-sm w-full transition-all duration-300 font-semibold shadow-lg border-2 border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/20"
            >
              Imprimir ticket
            </button>
          )}

          <button
            onClick={onClear}
            className="mt-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-3 rounded-xl text-sm w-full transition-all duration-300 font-semibold shadow-lg border-2 border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/20"
            disabled={isProcessingPayment}
          >
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
