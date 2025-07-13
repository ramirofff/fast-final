// ✅ Adaptación responsive mejorada con estética refinada y distribución profesional

'use client';

import { useEffect, useState } from 'react';
import { Product, Sale, CartItem } from './types';

import Cart from './components/Cart';
import AddProductModal from './components/AddProductModal';
import ProductListTable from './components/ProductListTable';
import ProductList from './components/ProductList';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import SalesHistory from './components/SalesHistory';
import TicketView from './components/TicketView';
import CategoryChangeModal from './components/CategoryChangeModal';
import { PlusCircle, Clock, Home } from 'lucide-react';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeName, setStoreName] = useState<string>('');
  const [confirmedStoreName, setConfirmedStoreName] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [salesToday, setSalesToday] = useState<Sale[]>([]);
  const [showProductTable, setShowProductTable] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Sin categoría']);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [categoryProductId, setCategoryProductId] = useState<string>('');
  const [showCartMobile, setShowCartMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedCategories = localStorage.getItem('categories');
    const savedStore = localStorage.getItem('confirmedStoreName');

    if (savedProducts) setProducts(JSON.parse(savedProducts));

    let parsedCategories = savedCategories ? JSON.parse(savedCategories) : [];
    parsedCategories = parsedCategories.filter((cat: string) => cat !== 'Sin categoría');
    setCategories(['Sin categoría', ...parsedCategories]);

    if (savedStore) setConfirmedStoreName(savedStore);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      const updated = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleConfirmStoreName = () => {
    if (storeName.trim() !== '') {
      setConfirmedStoreName(storeName);
      localStorage.setItem('confirmedStoreName', storeName);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (categoryToDelete === 'Sin categoría') return;

    const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));

    const updatedProducts = products.map(p =>
      p.category === categoryToDelete ? { ...p, category: 'Sin categoría' } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    if (oldCat === 'Sin categoría' || !newCat.trim()) return;
    const updatedCategories = categories.map(cat => (cat === oldCat ? newCat : cat));
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));

    const updatedProducts = products.map(p =>
      p.category === oldCat ? { ...p, category: newCat } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const totalToday = salesToday.reduce((acc, sale) => acc + sale.total, 0);

  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === '' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // el return está bien estructurado, no hay cambios necesarios



return (
  <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 font-sans relative z-0 max-w-screen-2xl mx-auto transition-all duration-300 ease-in-out">
    
    {/* Barra de navegación superior */}
    <div className="fixed top-4 right-4 flex gap-3 z-50 animate-fade-in">
      <button
        onClick={() => {
          setShowProductTable(true);
          setShowHistory(false);
          setSelectedSale(null);
        }}
        className="hover:scale-110 transition-transform"
        title="Gestión de productos"
      >
        <PlusCircle size={32} className="text-green-500 hover:text-green-600" />
      </button>

      <button
        onClick={() => {
          setShowHistory(true);
          setShowProductTable(false);
        }}
        className="hover:scale-110 transition-transform"
        title="Historial de ventas"
      >
        <Clock size={32} className="text-blue-500 hover:text-blue-600" />
      </button>

      <button
        onClick={() => {
          setShowProductTable(false);
          setShowHistory(false);
          setSelectedSale(null);
        }}
        className="hover:scale-110 transition-transform"
        title="Inicio"
      >
        <Home size={32} className="text-gray-300 hover:text-white" />
      </button>
    </div>

    {/* Contenido general: izquierda productos, derecha carrito */}
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 pt-20">
      <div className="space-y-4">
        {!showProductTable && !showHistory && (
          <Header
            storeName={storeName}
            setStoreName={setStoreName}
            confirmedStoreName={confirmedStoreName}
            setConfirmedStoreName={handleConfirmStoreName}
          />
        )}

        {/* Tabla de productos */}
        {showProductTable && (
          <div className="bg-white/10 border border-white/10 backdrop-blur rounded-xl p-4 shadow-lg">
            <ProductListTable
              products={products}
              onDelete={(id) => {
                const updated = products.filter(p => p.id !== id);
                setProducts(updated);
                localStorage.setItem('products', JSON.stringify(updated));
              }}
              onStartEditPrice={(id, price) => {
                setEditingProductId(id);
                setEditingPrice(price.toString());
              }}
              editingProductId={editingProductId}
              editingPrice={editingPrice}
              setEditingPrice={setEditingPrice}
              onApplyPriceUpdate={() => {
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
              }}
              categories={categories}
              setProducts={setProducts}
              setEditingProductId={setEditingProductId}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
              onUpdateProductCategory={(id, newCategory) => {
                const updated = products.map(p =>
                  p.id === id ? { ...p, category: newCategory } : p
                );
                setProducts(updated);
                localStorage.setItem('products', JSON.stringify(updated));
              }}
              onOpenCategoryChange={(id) => {
                setCategoryProductId(id);
                setShowCategoryModal(true);
              }}
            />
          </div>
        )}

        {/* Historial de ventas */}
        {showHistory && (
          <SalesHistory
            salesToday={salesToday}
            totalToday={totalToday}
            onBack={() => setShowHistory(false)}
            onClear={() => {
              localStorage.removeItem('salesHistory');
              setSalesToday([]);
            }}
            onViewTicket={setSelectedSale}
            localName={confirmedStoreName}
          />
        )}

        {/* Lista de productos normal */}
        {!showHistory && !showProductTable && confirmedStoreName && (
          <>
            <CategorySelector
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
            />

            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full p-2 mt-2 bg-gray-800 border border-gray-700 rounded text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ProductList
              products={filteredProducts}
              onAddToCart={addToCart}
              onDelete={(id) => {
                const updated = products.filter(p => p.id !== id);
                setProducts(updated);
                localStorage.setItem('products', JSON.stringify(updated));
              }}
              onStartEditPrice={(id, price) => {
                setEditingProductId(id);
                setEditingPrice(price.toString());
              }}
              editingProductId={editingProductId}
              editingPrice={editingPrice}
              setEditingPrice={setEditingPrice}
              onApplyPriceUpdate={() => {
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
              }}
            />
          </>
        )}

        {/* Vista de ticket */}
        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white text-black p-4 rounded-xl w-full max-w-md">
              <TicketView sale={selectedSale} onClose={() => setSelectedSale(null)} />
            </div>
          </div>
        )}
      </div>

      {/* Carrito (desktop) */}
      {!showHistory && !showProductTable && confirmedStoreName && (
        <div className="hidden xl:block">
          <Cart
            cart={cartItems}
            onClear={() => setCartItems([])}
            onUpdateQuantity={(id, quantity) => {
              if (quantity <= 0) {
                setCartItems(prev => prev.filter(item => item.id !== id));
              } else {
                setCartItems(prev =>
                  prev.map(item =>
                    item.id === id ? { ...item, quantity } : item
                  )
                );
              }
            }}
            onConfirm={(sale) => {
              setSelectedSale(sale);
              setShowHistory(false);
              setShowProductTable(false);
            }}
          />
        </div>
      )}
    </div>
  </main>
);



  ;
;

;
  ;
}
