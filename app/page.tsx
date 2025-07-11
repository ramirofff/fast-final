'use client';

import { useEffect, useState } from 'react';
import Cart from './components/Cart';
import AddProductModal from './components/AddProductModal';
import ProductList from './components/ProductList';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import SalesHistory from './components/SalesHistory';
import TicketView from './components/TicketView';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Sale {
  timestamp: string;
  items: Product[];
  total: number;
  discount: number;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState<string>('');
  const [confirmedStoreName, setConfirmedStoreName] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [salesToday, setSalesToday] = useState<Sale[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCategories = localStorage.getItem('categories');
    const savedStore = localStorage.getItem('confirmedStoreName');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedStore) setConfirmedStoreName(savedStore);
  }, []);

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
  };

  const handleAddProduct = (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    if (!categories.includes(product.category)) {
      const updatedCats = [...categories, product.category];
      setCategories(updatedCats);
      localStorage.setItem('categories', JSON.stringify(updatedCats));
    }
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const handleStartEditing = (id: string, currentPrice: number) => {
    setEditingProductId(id);
    setEditingPrice(currentPrice.toString());
  };

  const handleApplyPriceUpdate = () => {
    const newPrice = parseFloat(editingPrice);
    if (isNaN(newPrice)) return;

    const updated = products.map(p =>
      p.id === editingProductId ? { ...p, price: newPrice } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));

    const updatedCart = cartItems.map(p =>
      p.id === editingProductId ? { ...p, price: newPrice } : p
    );
    setCartItems(updatedCart);

    setEditingProductId(null);
    setEditingPrice('');
  };

  const handleShowHistory = () => {
    const allSales: Sale[] = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const filtered = allSales.filter(sale => sale.timestamp.startsWith(today));
    setSalesToday(filtered);
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('salesHistory');
    setSalesToday([]);
  };

  const handleConfirmStoreName = () => {
    if (storeName.trim() !== '') {
      setConfirmedStoreName(storeName);
      localStorage.setItem('confirmedStoreName', storeName);
    }
  };

  const totalToday = salesToday.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4 font-sans relative">
      <div className="max-w-screen-xl mx-auto space-y-4">
        {!showHistory && (
          <Header
            storeName={storeName}
            setStoreName={setStoreName}
            confirmedStoreName={confirmedStoreName}
            setConfirmedStoreName={handleConfirmStoreName}
          />
        )}

        {!showHistory && confirmedStoreName && (
          <div className="flex gap-3 flex-wrap justify-center mb-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Agregar producto
            </button>
            <button
              onClick={handleShowHistory}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
            >
              Historial de ventas del día
            </button>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <AddProductModal
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProduct}
              />
            </div>
          </div>
        )}

        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <TicketView sale={selectedSale} onClose={() => setSelectedSale(null)} />
            </div>
          </div>
        )}

        {showHistory ? (
          <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6">
            <SalesHistory
              salesToday={salesToday}
              totalToday={totalToday}
              onBack={() => setShowHistory(false)}
              onClear={handleClearHistory}
              onViewTicket={setSelectedSale}
              localName={confirmedStoreName}
            />
          </div>
        ) : (
          confirmedStoreName && (
            <>
              <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-4">
                <CategorySelector
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
              <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6">
                <ProductList
                  products={products.filter(
                    p => activeCategory === '' || p.category === activeCategory
                  )}
                  onAddToCart={addToCart}
                  onDelete={handleDeleteProduct}
                  onStartEditPrice={handleStartEditing}
                  editingProductId={editingProductId}
                  editingPrice={editingPrice}
                  setEditingPrice={setEditingPrice}
                  onApplyPriceUpdate={handleApplyPriceUpdate}
                />
              </div>
            </>
          )
        )}
      </div>

      {!showHistory && confirmedStoreName && (
        <div className="fixed top-24 right-4 w-80 max-h-[80vh] overflow-y-auto bg-white/90 border border-gray-300 rounded-xl shadow-xl p-4 z-50 backdrop-blur">
          <Cart cart={cartItems} onClear={() => setCartItems([])} />
        </div>
      )}
    </main>
  );
}
