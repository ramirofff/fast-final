'use client';

import { useEffect, useState } from 'react';
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
  const [showProductTable, setShowProductTable] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Sin categoría']);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [categoryProductId, setCategoryProductId] = useState<string>('');

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
    setCartItems([...cartItems, product]);
  };

  const handleAddProduct = (product: Product) => {
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    if (!categories.includes(product.category) && product.category !== 'Sin categoría') {
      const updatedCats = [...categories, product.category];
      setCategories(['Sin categoría', ...updatedCats.filter(c => c !== 'Sin categoría')]);
      localStorage.setItem('categories', JSON.stringify(['Sin categoría', ...updatedCats.filter(c => c !== 'Sin categoría')]));
    }
    setShowAddModal(false);
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

  const handleOpenCategoryChange = (id: string) => {
    setCategoryProductId(id);
    setShowCategoryModal(true);
  };

  const handleUpdateProductCategory = (id: string, newCategory: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, category: newCategory } : p
    );
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));

    if (!categories.includes(newCategory) && newCategory !== 'Sin categoría') {
      const updatedCats = [...categories, newCategory];
      setCategories(['Sin categoría', ...updatedCats.filter(c => c !== 'Sin categoría')]);
      localStorage.setItem('categories', JSON.stringify(['Sin categoría', ...updatedCats.filter(c => c !== 'Sin categoría')]));
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (categoryToDelete === 'Sin categoría') return;
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete && cat !== 'Sin categoría');
    setCategories(['Sin categoría', ...updatedCategories]);
    localStorage.setItem('categories', JSON.stringify(['Sin categoría', ...updatedCategories]));

    const updatedProducts = products.map(p =>
      p.category === categoryToDelete ? { ...p, category: 'Sin categoría' } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    if (activeCategory === categoryToDelete) setActiveCategory('Sin categoría');
  };

  const handleEditCategory = (oldCat: string, newCat: string) => {
    if (!newCat.trim() || categories.includes(newCat) || oldCat === 'Sin categoría') return;

    const updatedCategories = categories.map(cat =>
      cat === oldCat ? newCat : cat
    );
    setCategories(['Sin categoría', ...updatedCategories.filter(c => c !== 'Sin categoría')]);
    localStorage.setItem('categories', JSON.stringify(['Sin categoría', ...updatedCategories.filter(c => c !== 'Sin categoría')]));

    const updatedProducts = products.map(p =>
      p.category === oldCat ? { ...p, category: newCat } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    if (activeCategory === oldCat) setActiveCategory(newCat);
  };

  const handleShowHistory = () => {
    const allSales: Sale[] = JSON.parse(localStorage.getItem('salesHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const filtered = allSales.filter(sale => sale.timestamp.startsWith(today));
    setSalesToday(filtered);
    setShowHistory(true);
    setShowProductTable(false);
  };

  const handleShowProductTable = () => {
    setShowProductTable(true);
    setShowHistory(false);
    setSelectedSale(null);
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
  <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4 font-sans relative z-0 max-w-screen-2xl mx-auto">
    {/* Íconos flotantes arriba a la derecha */}
    <div className="fixed top-4 right-4 flex gap-3 z-50">
      <button onClick={handleShowProductTable} className="hover:scale-110 transition-transform">
        <PlusCircle size={32} className="text-green-600 hover:text-green-700" />
      </button>
      <button onClick={handleShowHistory} className="hover:scale-110 transition-transform">
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

    {/* Layout general: contenido principal + carrito */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 max-w-screen-2xl mx-auto pt-20">
      {/* Columna principal */}
      <div className="space-y-4">
        {!showHistory && !showProductTable && (
          <Header
            storeName={storeName}
            setStoreName={setStoreName}
            confirmedStoreName={confirmedStoreName}
            setConfirmedStoreName={handleConfirmStoreName}
          />
        )}

        {showProductTable && (
          <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Lista de productos</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow transition"
              >
                + Producto
              </button>
            </div>
            <ProductListTable
              products={products}
              onDelete={handleDeleteProduct}
              onStartEditPrice={handleStartEditing}
              editingProductId={editingProductId}
              editingPrice={editingPrice}
              setEditingPrice={setEditingPrice}
              onApplyPriceUpdate={handleApplyPriceUpdate}
              categories={categories}
              setProducts={setProducts}
              setEditingProductId={setEditingProductId}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
              onUpdateProductCategory={handleUpdateProductCategory}
              onOpenCategoryChange={handleOpenCategoryChange}
            />
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />
            </div>
          </div>
        )}

        {showCategoryModal && (
          <CategoryChangeModal
            productId={categoryProductId}
            categories={categories}
            onClose={() => setShowCategoryModal(false)}
            onUpdateCategory={handleUpdateProductCategory}
          />
        )}

        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
              <TicketView sale={selectedSale} onClose={() => setSelectedSale(null)} />
            </div>
          </div>
        )}

        {showHistory && (
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
            <div className="bg-white/80 backdrop-blur border rounded-2xl shadow-md p-6 relative z-10">
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
        )}
      </div>

      {/* Columna del carrito */}
{!showHistory && !showProductTable && confirmedStoreName && (
    <div className="fixed top-24 right-4 w-[240px] ... block lg:block">
    <Cart cart={cartItems} onClear={() => setCartItems([])} />
  </div>
)}
    </div>
  </main>
);

}
