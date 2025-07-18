'use client';

import React, { useEffect, useState } from 'react';
import { CartItem } from '../types';

interface Props {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartItemRow({ item, onUpdateQuantity }: Props) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity.toString());

  useEffect(() => {
    setLocalQuantity(item.quantity.toString());
  }, [item.quantity]);

  const handleBlur = () => {
    const qty = parseInt(localQuantity);
    if (!isNaN(qty)) {
      onUpdateQuantity(item.id, qty);
    }
  };

  return (
    <li className="flex items-center gap-4 border-b-2 border-blue-500/10 pb-4 group hover:border-blue-500/20 transition-all duration-300">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-xl shadow-lg border-2 border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300"
        />
      )}
      <div className="flex-1">
        <p className="text-sm text-white">{item.name}</p>
        <p className="text-green-400 font-semibold text-sm">
          USD ${item.price.toFixed(2)} x {item.quantity}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="number"
            min="0"
            value={localQuantity}
            onChange={(e) => setLocalQuantity(e.target.value)}
            onBlur={handleBlur}
            className="px-3 py-2 w-20 rounded-xl bg-[#0b1728] text-white text-sm border-2 border-blue-500/20 focus:border-blue-500/40 shadow-lg transition-all duration-300 focus:outline-none"
          />
          <button
            onClick={() => onUpdateQuantity(item.id, 0)}
            className="text-red-400 text-sm hover:text-red-500 transition-colors duration-300"
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </li>
  );
}
