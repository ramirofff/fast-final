export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  timestamp: string;
  items: Product[];
  total: number;
  discount: number;
}
