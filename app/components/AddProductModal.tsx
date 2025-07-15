'use client';

import { useState } from 'react';
import { Product } from '../types';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface AddProductModalProps {
  categories: string[];
  onClose: () => void;
  onAdd: (product: Product) => void;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  categories,
  onClose,
  onAdd,
  setCategories,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Sin categoría');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const filename = `${user.id}/${uuidv4()}-${imageFile.name}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, imageFile);

    if (error || !data) {
      console.error('Error al subir imagen:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return urlData?.publicUrl || null;
  };

  const handleAdd = async () => {
    const parsedPrice = parseFloat(price);
    if (!name.trim() || isNaN(parsedPrice)) {
      alert('Nombre y precio válidos requeridos');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('No autenticado');
      return;
    }

    const uploadedImageUrl = await handleImageUpload();

    if (!categories.includes(category)) {
      const { error: catError } = await supabase
        .from('categories')
        .insert({ name: category, user_id: user.id });
      if (!catError) {
        setCategories(prev => [...prev, category]);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name,
        price: parsedPrice,
        original_price: parsedPrice,
        category,
        image_url: uploadedImageUrl || null,
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
    <div className="space-y-4 bg-[#0b1728] text-white p-6 rounded-2xl border border-gray-700 shadow-xl">
      <h2 className="text-xl font-semibold">Agregar producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-600 bg-[#1e293b] text-white p-2 rounded"
      />

      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border border-gray-600 bg-[#1e293b] text-white p-2 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="w-full border border-gray-600 bg-[#1e293b] text-white p-2 rounded file:text-white file:bg-gray-700 file:border-0"
      />

      {!isCustomCategory ? (
        <div className="space-y-1">
          <label className="text-sm text-gray-300">Categoría</label>
          <select
            value={category}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__other__') {
                setIsCustomCategory(true);
                setCategory('');
              } else {
                setCategory(val);
              }
            }}
            className="w-full border border-gray-600 bg-[#1e293b] text-white p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__other__">Otra...</option>
          </select>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Nueva categoría</label>
          <input
            type="text"
            placeholder="Nueva categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-600 bg-[#1e293b] text-white p-2 rounded"
          />
          <button
            onClick={() => {
              setIsCustomCategory(false);
              setCategory(categories[0] || 'Sin categoría');
            }}
            className="text-sm text-blue-400 underline"
          >
            Volver a selección
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AddProductModal;
