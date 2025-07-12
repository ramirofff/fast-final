// app/components/CartItemRow.tsx
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

  return (
    <li className="flex items-center gap-2 border-b pb-1">
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
            value={localQuantity}
            onChange={(e) => setLocalQuantity(e.target.value)}
            onBlur={() => {
              const qty = parseInt(localQuantity) || 0;
              onUpdateQuantity(item.id, qty);
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
  );
}
