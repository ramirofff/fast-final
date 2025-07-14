'use client';

import React, { useState } from 'react';
import { Product } from '../types';
import { Pencil, ShoppingCart } from 'lucide-react';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onDelete: (id: string) => void;
  onStartEditPrice: (id: string, currentPrice: number) => void;
  editingProductId: string | null;
  editingPrice: string;
  setEditingPrice: (value: string) => void;
  onApplyPriceUpdate: () => void;
  onOpenCategoryChange: (id: string) => void;
  categories: string[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setEditingProductId: React.Dispatch<React.SetStateAction<string | null>>;
  onDeleteCategory: (cat: string) => void;
  onEditCategory: (oldCat: string, newCat: string) => void;
  onUpdateProductCategory: (id: string, newCat: string) => void;
}

const ProductListTable: React.FC<Props> = ({
  products,
  onAddToCart,
  onDelete,
  onStartEditPrice,
  editingProductId,
  editingPrice,
  setEditingPrice,
  onApplyPriceUpdate,
  onOpenCategoryChange,
  categories,
  setProducts,
  setEditingProductId,
  onDeleteCategory,
  onEditCategory,
  onUpdateProductCategory,
}) => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-white text-lg font-semibold">Productos encontrados: {sortedProducts.length}</h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
          className="px-3 py-1 bg-gray-800 text-white border border-gray-600 rounded"
        >
          <option value="name-asc">Nombre (A–Z)</option>
          <option value="name-desc">Nombre (Z–A)</option>
          <option value="price-asc">Precio (menor a mayor)</option>
          <option value="price-desc">Precio (mayor a menor)</option>
        </select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          😕 No se encontraron productos que coincidan.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sortedProducts.map((product) => {
            const showDiscount = product.originalPrice && product.originalPrice > product.price;
            return (
              <div
                key={product.id}
                className="bg-[#0b1728] text-white p-4 rounded-2xl shadow-md flex flex-col justify-between relative transition hover:shadow-xl border border-gray-700 hover:scale-[1.02] duration-200"
              >
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => setShowModal(product.id)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="w-full h-28 mb-2 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || '/no-image.png'}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <h3 className="font-semibold text-base truncate" title={product.name}>{product.name}</h3>
                <p className="text-xs text-gray-400 mb-1">
                  {product.category === 'Sin categoría' ? (
                    <span className="text-red-400">Sin categoría</span>
                  ) : (
                    product.category
                  )}
                </p>

                {showDiscount ? (
                  <>
                    <p className="text-sm text-red-400 line-through">
                      USD ${product.originalPrice?.toFixed(2)}
                    </p>
                    <p className="text-green-400 font-bold text-lg mb-2">
                      USD ${product.price.toFixed(2)}
                    </p>
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Oferta
                    </span>
                  </>
                ) : (
                  <p className="text-green-400 font-bold text-lg mb-2">
                    USD ${product.price.toFixed(2)}
                  </p>
                )}

                {editingProductId === product.id ? (
                  <div className="mb-2">
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className="border border-gray-500 p-1 rounded w-full mb-1 text-sm text-black"
                    />
                    <button
                      onClick={onApplyPriceUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-sm rounded w-full transition"
                    >
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-xl flex items-center justify-center gap-2 transition shadow hover:shadow-md"
                  >
                    <ShoppingCart size={16} />
                    Agregar al carro
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">¿Qué deseas hacer?</h2>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const product = products.find(p => p.id === showModal);
                  if (product) onStartEditPrice(product.id, product.price);
                  setShowModal(null);
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
              >
                Modificar precio
              </button>

              <button
                onClick={() => {
                  onOpenCategoryChange(showModal);
                  setShowModal(null);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Asignar/cambiar categoría
              </button>

              <button
                onClick={() => {
                  onDelete(showModal);
                  setShowModal(null);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Eliminar producto
              </button>

              <button
                onClick={() => setShowModal(null)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition"
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

export default ProductListTable;
