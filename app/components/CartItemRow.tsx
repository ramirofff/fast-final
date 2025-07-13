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
    <li className="flex items-center gap-3 border-b border-gray-600 pb-2">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 object-cover rounded shadow"
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
            className="px-2 py-1 w-16 rounded bg-gray-700 text-white text-sm border border-gray-500"
          />
          <button
            onClick={() => onUpdateQuantity(item.id, 0)}
            className="text-red-400 text-sm hover:text-red-500"
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
    </li>
  );
}
