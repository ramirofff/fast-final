'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { Pencil, ShoppingCart, Tag } from 'lucide-react';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onDelete: (id: string) => void;
  onStartEditPrice: (id: string, currentPrice: number) => void;
  editingProductId: string | null;
  editingPrice: string;
  setEditingPrice: (value: string) => void;
  onApplyPriceUpdate: () => void;
  onOpenCategoryChange: (id: string) => void; // ✅ nueva prop
}

const ProductList: React.FC<Props> = ({
  products,
  onAddToCart,
  onDelete,
  onStartEditPrice,
  editingProductId,
  editingPrice,
  setEditingPrice,
  onApplyPriceUpdate,
  onOpenCategoryChange,
}) => {
  const [showModal, setShowModal] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900 text-white p-4 rounded-2xl shadow-md flex flex-col justify-between relative transition hover:shadow-xl border border-gray-700"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setShowModal(product.id)}
                className="text-gray-400 hover:text-gray-200"
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="w-full h-28 mb-2 rounded-xl border border-gray-700 bg-gray-900 flex items-center justify-center overflow-hidden">
              <img
                src={product.image || '/no-image.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-semibold text-base">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-1">
              {product.category === 'Sin categoría' ? (
                <span className="text-red-400">Sin categoría</span>
              ) : (
                product.category
              )}
            </p>
            <p className="text-green-700 font-bold text-lg mb-2">
              USD ${product.price.toFixed(2)}
            </p>

            {editingProductId === product.id ? (
              <div className="mb-2">
                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) => setEditingPrice(e.target.value)}
                  className="border p-1 rounded w-full mb-1 text-sm text-black"
                />
                <button
                  onClick={onApplyPriceUpdate}
                  className="bg-green-600 text-white px-2 py-1 text-sm rounded w-full"
                >
                  Aplicar
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="bg-green-600 text-white w-full py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <ShoppingCart size={16} />
                Agregar al carro
              </button>
            )}


          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">¿Qué deseas hacer?</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const product = products.find(p => p.id === showModal);
                  if (product) onStartEditPrice(product.id, product.price);
                  setShowModal(null);
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
              >
                Modificar precio
              </button>

              <button
                onClick={() => {
                  onOpenCategoryChange(showModal);
                  setShowModal(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Asignar/cambiar categoría
              </button>

              <button
                onClick={() => {
                  onDelete(showModal);
                  setShowModal(null);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
                Eliminar producto
              </button>

              <button
                onClick={() => setShowModal(null)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
