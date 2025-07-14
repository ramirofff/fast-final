export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;        // Puede venir de image_url en Supabase
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id?: string; // opcional porque lo pone Supabase automáticamente
  created_at: string; // viene de Supabase como timestamp ISO
  items: Product[];   // serializado como JSON en la base de datos
  total: number;
  discount: number;
  user_id?: string; // útil para distinguir por vendedor si usás múltiples cuentas
}
