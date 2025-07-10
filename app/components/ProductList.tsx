import React from 'react';
import { Product } from '../page';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onDelete: (id: string) => void;
  onStartEditPrice: (id: string, currentPrice: number) => void;
  editingProductId: string | null;
  editingPrice: string;
  setEditingPrice: (value: string) => void;
  onApplyPriceUpdate: () => void;
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
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white p-3 rounded-lg shadow-md flex flex-col justify-between"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-24 object-cover mb-2 rounded"
            />
          )}
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-700 mb-1">${product.price.toFixed(2)}</p>

          {editingProductId === product.id ? (
            <div className="mb-2">
              <input
                type="number"
                value={editingPrice}
                onChange={(e) => setEditingPrice(e.target.value)}
                className="border p-1 rounded w-full mb-1"
              />
              <button
                onClick={onApplyPriceUpdate}
                className="bg-green-600 text-white px-2 py-1 text-sm rounded w-full"
              >
                Aplicar
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => onAddToCart(product)}
                className="bg-blue-500 text-white w-full py-1 rounded hover:bg-blue-600"
              >
                Agregar
              </button>
              <button
                onClick={() => onStartEditPrice(product.id, product.price)}
                className="bg-yellow-500 text-white w-full py-1 rounded hover:bg-yellow-600"
              >
                Modificar precio
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-600 text-white w-full py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
