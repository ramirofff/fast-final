'use client';

import { useState } from 'react';
import { Product } from '../types';

interface ProductListTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onStartEditPrice: (id: string, currentPrice: number) => void;
  editingProductId: string | null;
  editingPrice: string;
  setEditingPrice: (value: string) => void;
  onApplyPriceUpdate: () => void;
  categories: string[];
  setProducts: (products: Product[]) => void;
  setEditingProductId: (id: string | null) => void;
  onDeleteCategory: (cat: string) => void;
  onEditCategory: (oldCat: string, newCat: string) => void;
  onUpdateProductCategory: (id: string, newCategory: string) => void;
  onOpenCategoryChange: (id: string) => void;
}

export default function ProductListTable({
  products,
  onDelete,
  onStartEditPrice,
  editingProductId,
  editingPrice,
  setEditingPrice,
  onApplyPriceUpdate,
  categories,
  setProducts,
  setEditingProductId,
  onDeleteCategory,
  onEditCategory,
  onUpdateProductCategory,
  onOpenCategoryChange,
}: ProductListTableProps) {
  const [editingField, setEditingField] = useState<'name' | 'category' | 'price' | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const startEdit = (id: string, field: 'name' | 'category' | 'price', value: string | number) => {
    setEditingProductId(id);
    setEditingField(field);
    if (field === 'name') setEditingName(String(value));
    if (field === 'category') setEditingCategory(String(value));
    if (field === 'price') setEditingPrice(String(value));
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditingField(null);
  };

  const handleSaveName = (id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, name: editingName } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    cancelEdit();
  };

  const handleSaveCategory = (id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, category: editingCategory } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    cancelEdit();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 placeholder:text-gray-400"
      />

      <div className="overflow-x-auto bg-gray-900 shadow-lg rounded-xl border border-gray-700">
        <table className="w-full text-sm text-gray-200">
          <thead className="bg-gray-800 text-gray-300 border-b border-gray-700">
            <tr className="text-left">
              <th className="p-3 font-semibold">Foto</th>
              <th className="p-3 font-semibold">Nombre</th>
              <th className="p-3 font-semibold">Categoría</th>
              <th className="p-3 font-semibold">Precio</th>
              <th className="p-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-800">
                <td className="p-3">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )}
                </td>
                <td className="p-3 w-40">
                  {editingProductId === product.id && editingField === 'name' ? (
                    <div className="flex gap-1 items-center">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border px-2 py-1 rounded w-28 bg-gray-800 text-gray-100"
                      />
                      <button
                        onClick={() => handleSaveName(product.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 rounded text-xs"
                      >
                        ✔
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 rounded text-xs"
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEdit(product.id, 'name', product.name)}
                      className="cursor-pointer hover:text-blue-400"
                    >
                      ✏️ {product.name}
                    </span>
                  )}
                </td>
                <td className="p-3 w-40">
                  {editingProductId === product.id && editingField === 'category' ? (
                    <div className="flex gap-1 items-center">
                      <select
                        value={editingCategory}
                        onChange={(e) => setEditingCategory(e.target.value)}
                        className="border px-2 py-1 rounded w-28 bg-gray-800 text-gray-100"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSaveCategory(product.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 rounded text-xs"
                      >
                        ✔
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 rounded text-xs"
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEdit(product.id, 'category', product.category)}
                      className="cursor-pointer hover:text-blue-400"
                    >
                      ✏️ {product.category}
                    </span>
                  )}
                </td>
                <td className="p-3 w-32">
                  {editingProductId === product.id && editingField === 'price' ? (
                    <div className="flex gap-1 items-center">
                      <input
                        type="number"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="border px-2 py-1 rounded w-24 bg-gray-800 text-gray-100"
                      />
                      <button
                        onClick={onApplyPriceUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 rounded text-xs"
                      >
                        ✔
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 rounded text-xs"
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEdit(product.id, 'price', product.price)}
                      className="cursor-pointer hover:text-blue-400"
                    >
                      ✏️ ${product.price.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 hover:text-red-600 text-sm hover:underline"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
