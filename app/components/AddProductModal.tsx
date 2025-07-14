// Nuevo componente AddProductModal simplificado solo para agregar productos

'use client';

import { useState } from 'react';
import { Product } from '../types';
import { supabase } from '@/lib/supabaseClient';

interface AddProductModalProps {
  categories: string[];
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ categories, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Sin categoría');
  const [imageUrl, setImageUrl] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');

  const handleAdd = async () => {
    const parsedPrice = parseFloat(price);
    const parsedOriginal = parseFloat(originalPrice);
    if (!name.trim() || isNaN(parsedPrice)) {
      alert('Nombre y precio válido requeridos');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('No autenticado');
      return;
    }

    const effectiveOriginalPrice = isNaN(parsedOriginal) ? parsedPrice : parsedOriginal;

    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name,
        price: parsedPrice,
        category,
        image_url: imageUrl || null,
        original_price: effectiveOriginalPrice,
      })
      .select()
      .single();

    if (error || !data) {
      alert('Error al agregar producto');
      return;
    }

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      price: data.price,
      category: data.category,
      image: data.image_url,
      originalPrice: data.original_price || undefined,
    };

    onAdd(newProduct);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-black">Agregar producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded"
      />
      <input
        type="number"
        placeholder="Precio original (opcional)"
        value={originalPrice}
        onChange={(e) => setOriginalPrice(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded"
      />
      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="flex justify-between mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AddProductModal;
