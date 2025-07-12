// ✅ Adaptación responsive completa con buscador y recuperación de funcionalidades

'use client';

import { useEffect, useState } from 'react';
import { Product, Sale, CartItem } from './types'; // ✅ importa correctamente

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
  
return (
  <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4 font-sans relative z-0 max-w-screen-2xl mx-auto">
    <div className="fixed top-4 right-4 flex gap-3 z-50">
      <button
        onClick={() => {
          setShowProductTable(true);
          setShowHistory(false);
          setSelectedSale(null);
        }}
        className="hover:scale-110 transition-transform"
      >
        <PlusCircle size={32} className="text-green-600 hover:text-green-700" />
      </button>

      <button
        onClick={() => {
          setShowHistory(true);
          setShowProductTable(false);
        }}
        className="hover:scale-110 transition-transform"
      >
        <Clock size={32} className="text-blue-600 hover:text-blue-700" />
      </button>

      <button
        onClick={() => {
          setShowProductTable(false);
          setShowHistory(false);
          setSelectedSale(null);
        }}
        className="hover:scale-110 transition-transform"
      >
        <Home size={32} className="text-gray-600 hover:text-black" />
      </button>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 pt-20">
      <div className="space-y-4">

        {showProductTable && (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded mb-4"
            >
              + Agregar nuevo producto
            </button>

            <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6">
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
          </>
        )}

        {!showHistory && !showProductTable && (
          <Header
            storeName={storeName}
            setStoreName={setStoreName}
            confirmedStoreName={confirmedStoreName}
            setConfirmedStoreName={handleConfirmStoreName}
          />
        )}

        {!showHistory && !showProductTable && confirmedStoreName && (
          <>
            <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-4 relative z-20">
              <CategorySelector
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onDeleteCategory={handleDeleteCategory}
                onEditCategory={handleEditCategory}
              />
            </div>
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full p-2 border rounded shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6 relative z-10">
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
            </div>
          </>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <AddProductModal
                onClose={() => setShowAddModal(false)}
                onAdd={(product) => {
                  const updated = [...products, product];
                  setProducts(updated);
                  localStorage.setItem('products', JSON.stringify(updated));
                  if (!categories.includes(product.category)) {
                    const updatedCats = [...categories, product.category];
                    setCategories(updatedCats);
                    localStorage.setItem('categories', JSON.stringify(updatedCats));
                  }
                  setShowAddModal(false);
                }}
              />
            </div>
          </div>
        )}

        {showHistory && (
          <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6">
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
          </div>
        )}

        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <TicketView sale={selectedSale} onClose={() => setSelectedSale(null)} />
            </div>
          </div>
        )}
      </div>

      {!showHistory && !showProductTable && confirmedStoreName && (
        <div className="hidden lg:block fixed top-24 right-4 w-[260px]">
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

      {!showHistory && !showProductTable && confirmedStoreName && (
        <>
          <button
            onClick={() => setShowCartMobile(true)}
            className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg lg:hidden z-50 relative"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                {cartItems.length}
              </span>
            )}
          </button>

          {showCartMobile && (
            <div className="fixed inset-0 z-40 flex justify-end bg-black/40 lg:hidden">
              <div className="w-full sm:w-4/5 max-w-xs h-full bg-white shadow-lg p-4 overflow-y-auto">
                <button
                  onClick={() => setShowCartMobile(false)}
                  className="text-red-500 mb-4 font-semibold"
                >
                  ✖ Cerrar
                </button>
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
                    setShowCartMobile(false);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </main>
);


  
;

  ;
}
