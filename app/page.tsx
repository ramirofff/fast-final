'use client';

import { useState, useEffect } from 'react';
import Cart from './components/Cart';
import AddProductModal from './components/AddProductModal';
import ProductList from './components/ProductList';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Sale {
  timestamp: string;
  items: Product[];
  total: number;
  discount: number;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState<string>('Mi Local');
  const [confirmedStoreName, setConfirmedStoreName] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [salesToday, setSalesToday] = useState<Sale[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

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
    setEditingProductId(null);
    setEditingPrice('');
  };

  const handleShowHistory = () => {
    const allSales: Sale[] = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const filtered = allSales.filter((sale) => sale.timestamp.startsWith(today));
    setSalesToday(filtered);
    setShowHistory(true);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('salesHistory');
    setSalesToday([]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('products');
    const savedCats = localStorage.getItem('categories');
    if (saved) setProducts(JSON.parse(saved));
    if (savedCats) setCategories(JSON.parse(savedCats));
  }, []);

  const totalToday = salesToday.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 font-sans">
      <style>{`
        @media print {
          .no-print { display: none; }
          .print\\:bg-white { background-color: white !important; }
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-blue-800">Administración de Ventas</h1>

        <div className="mb-4 flex gap-2 items-center">
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="border p-2 rounded shadow w-full max-w-xs"
            placeholder="Nombre del local"
          />
          <button
            onClick={() => setConfirmedStoreName(storeName)}
            className="bg-green-500 text-white px-3 py-2 rounded shadow"
          >
            ✓
          </button>
        </div>

        {confirmedStoreName && (
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">{confirmedStoreName}</h2>
        )}

        {!showHistory && (
          <div className="flex gap-2 mb-4 flex-wrap justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded shadow"
            >
              Agregar producto
            </button>
            <button
              onClick={handleShowHistory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Historial de ventas del día
            </button>
          </div>
        )}

        {showAddModal && (
          <AddProductModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddProduct}
          />
        )}

        {selectedSale && (
          <div className="bg-gray-50 border p-4 rounded-lg mb-4 shadow print:bg-white">
            <h3 className="text-2xl font-bold text-center mb-2">{confirmedStoreName || storeName}</h3>
            <p className="text-center text-sm text-gray-700 mb-1">
              Fecha: {new Date(selectedSale.timestamp).toLocaleDateString()}
            </p>
            <p className="text-center text-sm text-gray-700 mb-1">
              Hora: {new Date(selectedSale.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-center font-mono text-xs text-gray-500 mb-4">
              Ticket #{selectedSale.timestamp.replace(/[-:T.]/g, '').slice(0, 14)}
            </p>
            <ul className="mb-2">
              {selectedSale.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="text-right text-sm text-gray-700">
              Descuento: ${selectedSale.discount?.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-right font-bold">
              Total: ${selectedSale.total.toFixed(2)}
            </div>
            <p className="text-center mt-6 text-sm italic text-gray-600">
              ¡Gracias por su compra!
            </p>
            <div className="flex justify-end gap-2 mt-4 no-print">
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Imprimir
              </button>
              <button
                onClick={() => setSelectedSale(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cerrar ticket
              </button>
            </div>
          </div>
        )}

        {showHistory ? (
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Historial de ventas del día</h2>
            <div className="flex justify-between mb-2">
              <button
                onClick={() => setShowHistory(false)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Volver al menú principal
              </button>
              <button
                onClick={handleClearHistory}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Borrar historial
              </button>
            </div>
            {salesToday.length === 0 ? (
              <p className="text-gray-500">No hay ventas registradas hoy.</p>
            ) : (
              <ul className="space-y-4">
                {salesToday.map((sale, i) => (
                  <li key={i} className="border-b pb-2">
                    <div className="text-sm text-gray-600">
                      {new Date(sale.timestamp).toLocaleTimeString()} -
                      <span className="ml-2">Total: ${sale.total.toFixed(2)}</span>
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="ml-4 text-blue-600 underline text-sm"
                      >
                        Ver ticket
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="font-bold text-right mt-4">Total del día: ${totalToday.toFixed(2)}</div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full border shadow ${
                    activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setActiveCategory('')}
                className={`px-4 py-2 rounded-full border shadow ${
                  activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                Todas
              </button>
            </div>
            <ProductList
              products={products.filter(p => activeCategory === '' || p.category === activeCategory)}
              onAddToCart={addToCart}
              onDelete={handleDeleteProduct}
              onStartEditPrice={handleStartEditing}
              editingProductId={editingProductId}
              editingPrice={editingPrice}
              setEditingPrice={setEditingPrice}
              onApplyPriceUpdate={handleApplyPriceUpdate}
            />
          </>
        )}
      </div>

      {!showHistory && (
        <Cart cart={cartItems} onClear={() => setCartItems([])} />
      )}
    </main>
  );
}
