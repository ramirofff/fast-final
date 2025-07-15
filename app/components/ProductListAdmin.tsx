'use client';

import { Product } from '../types';
import { Pencil } from 'lucide-react';

interface ProductListAdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onDelete: (id: string) => void;
  onStartEditPrice: (id: string, currentPrice: number) => void;
  editingProductId: string | null;
  editingPrice: string;
  setEditingPrice: (value: string) => void;
  setEditingProductId: (value: string | null) => void;
  onApplyPriceUpdate: () => void;
  categories: string[];
  onOpenCategoryChange: (id: string) => void;
  onDeleteCategory?: (category: string) => void;
  onEditCategory?: (oldCategory: string, newCategory: string) => void;
  onUpdateProductCategory?: (productId: string, newCategory: string) => void;
  onStartEditName: (id: string, currentName: string) => void;
  editingName: string;
  setEditingName: (value: string) => void;
  onApplyNameUpdate: () => void;
}

export default function ProductListAdmin({
  products,
  setProducts,
  onDelete,
  onStartEditPrice,
  editingProductId,
  editingPrice,
  setEditingPrice,
  setEditingProductId,
  onApplyPriceUpdate,
  categories,
  onOpenCategoryChange,
  onDeleteCategory,
  onEditCategory,
  onUpdateProductCategory,
  onStartEditName,
  editingName,
  setEditingName,
  onApplyNameUpdate,
}: ProductListAdminProps) {
  return (
    <div className="overflow-x-auto mt-4 rounded-2xl border border-gray-700 bg-[#0b1728]">
      <table className="min-w-full table-auto text-sm text-white">
        <thead className="bg-[#1e293b] text-left text-gray-300">
          <tr>
            <th className="px-4 py-3">Imagen</th>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-gray-700 hover:bg-[#1a2535] transition">
              <td className="px-4 py-3">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-600 rounded" />
                )}
              </td>
              <td className="px-4 py-3 align-top">
                {editingProductId === product.id ? (
                  <div className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border rounded px-2 py-1 text-black"
                    />
                    <button
                      onClick={onApplyNameUpdate}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setEditingName('');
                      }}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {product.name}
                    <button
                      onClick={() => onStartEditName(product.id, product.name)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                {editingProductId === product.id ? (
                  <div className="flex gap-2 items-start">
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className="border rounded px-2 py-1 w-24 text-black"
                    />
                    <button
                      onClick={onApplyPriceUpdate}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setEditingPrice('');
                      }}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    ${product.price.toFixed(2)}
                    <button
                      onClick={() => onStartEditPrice(product.id, product.price)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  {product.category}
                  <button
                    onClick={() => onOpenCategoryChange(product.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-center align-top">
                <button
                  onClick={() => onDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
