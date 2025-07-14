export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;        // Puede venir de image_url en Supabase
  category: string;
  originalPrice?: number; // 👈 Agregado para permitir mostrar precios anteriores

}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id?: string;
  created_at: string;
  timestamp?: string; // ✅ agregado
  items: Product[];
  total: number;
  discount: number;
  user_id?: string;
}

