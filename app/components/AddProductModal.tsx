'use client';

import { useState } from 'react';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';

interface AddProductModalProps {
  onAdd: (product: Product) => void;
  onClose: () => void;
  categories: string[];
}

export default function AddProductModal({ onAdd, onClose, categories }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [imageFileBase64, setImageFileBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFileBase64(reader.result as string);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!name || !price) return;
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('Error al obtener usuario autenticado');
      setLoading(false);
      return;
    }

    let finalImageUrl = imageUrl;

    if (imageFileBase64) {
      try {
        const fileName = `${user.id}-${Date.now()}.png`;
        const base64Data = imageFileBase64.split(',')[1];
        const binary = atob(base64Data);
        const array = Uint8Array.from(binary, char => char.charCodeAt(0));
        const file = new Blob([array], { type: 'image/png' });

        const { error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(fileName, file, {
            upsert: true,
            contentType: 'image/png',
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      } catch (err) {
        console.error(err);
        alert('Error al subir imagen');
        setLoading(false);
        return;
      }
    }

    // Guardar categoría si es nueva
    if (category && !categories.includes(category)) {
      await supabase.from('categories').insert({
        name: category,
        user_id: user.id,
      });
    }

    const newProduct: Product = {
      id: uuidv4(),
      name,
      price: parseFloat(price),
      image: finalImageUrl,
      category: category || 'Sin categoría',
    };

    const { error } = await supabase.from('products').insert({
      id: newProduct.id,
      user_id: user.id,
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      image_url: newProduct.image,
    });

    if (error) {
      alert('Error al agregar producto: ' + error.message);
    } else {
      onAdd(newProduct);
    }

    setLoading(false);
    onClose();
  };

  return (
    <div className="space-y-4 bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center">Agregar producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <select
        value={isCustomCategory ? '__custom__' : category}
        onChange={(e) => {
          if (e.target.value === '__custom__') {
            setIsCustomCategory(true);
            setCategory('');
          } else {
            setIsCustomCategory(false);
            setCategory(e.target.value);
          }
        }}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
      >
        <option value="">Seleccionar categoría</option>
        {categories.filter(c => c !== 'Sin categoría').map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
        <option value="__custom__">Otra...</option>
      </select>

      {isCustomCategory && (
        <input
          type="text"
          placeholder="Nueva categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-2 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
        />
      )}

      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={imageUrl}
        onChange={(e) => {
          setImageUrl(e.target.value);
          setImageFileBase64(null);
        }}
        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full text-sm bg-gray-800 text-white"
      />

      {(imageFileBase64 || imageUrl) && (
        <div className="mt-2">
          <p className="text-sm text-gray-400">Vista previa:</p>
          <img
            src={imageFileBase64 || imageUrl}
            alt="Vista previa"
            className="w-24 h-24 object-cover border rounded border-white"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {loading ? 'Guardando...' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
