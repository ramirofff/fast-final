'use client';

import { useEffect, useState } from 'react';
import { Product, Sale, CartItem } from './types';
import { supabase } from '../lib/supabaseClient';
import Login from './components/Login';

import Cart from './components/Cart';
import AddProductModal from './components/AddProductModal';
import ProductListTable from './components/ProductListTable';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import SalesHistory from './components/SalesHistory';
import TicketView from './components/TicketView';
import CategoryChangeModal from './components/CategoryChangeModal';
import { PlusCircle, Clock, Home } from 'lucide-react';



export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeName, setStoreName] = useState<string>('');
  const [confirmedStoreName, setConfirmedStoreName] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
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


  // Verifica sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Carga productos del usuario autenticado

useEffect(() => {
  if (!session?.user) return;

  const fetchData = async () => {
    try {
      // Cargar nombre del local
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('store_name')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error cargando perfil:', profileError.message);
      } else if (profile?.store_name) {
        setStoreName(profile.store_name);
        setConfirmedStoreName(profile.store_name);
      }

      // Cargar productos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', session.user.id);

      if (productsError) {
        console.error('Error cargando productos:', productsError.message);
      } else if (productsData) {
        const mapped = productsData.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.image_url,
            originalPrice: p.original_price || undefined, // ✅ esto faltaba

        }));
        setProducts(mapped);
      }

      // Cargar categorías reales desde Supabase
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', session.user.id);

      if (catError) {
        console.error('Error cargando categorías:', catError.message);
      } else if (catData) {
        const unique = Array.from(new Set(catData.map(c => c.name)));
        setCategories(['Sin categoría', ...unique]);
      }
    } catch (err) {
      console.error('Error general en fetchData:', err);
    }
  };

  fetchData();
}, [session]);


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

  const handleConfirmStoreName = async () => {
    if (storeName.trim() !== '') {
          setConfirmedStoreName(storeName);

        // Guarda el nombre de la tienda en Supabase (tabla profiles)
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, store_name: storeName });

        if (error) console.error('Error al guardar nombre del local:', error.message);

    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
  if (categoryToDelete === 'Sin categoría') return;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (userError || !userId) {
    alert('Usuario no autenticado');
    return;
  }

  // 1. Actualizar productos que usaban esta categoría
  const { error: updateProductsError } = await supabase
    .from('products')
    .update({ category: 'Sin categoría' })
    .eq('category', categoryToDelete)
    .eq('user_id', userId);

  if (updateProductsError) {
    console.error('Error actualizando productos:', updateProductsError.message);
    return;
  }

  // 2. Eliminar la categoría en la tabla categories
  const { error: deleteCatError } = await supabase
    .from('categories')
    .delete()
    .eq('name', categoryToDelete)
    .eq('user_id', userId);

  if (deleteCatError) {
    console.error('Error eliminando categoría:', deleteCatError.message);
    return;
  }

  // 3. Refrescar estado local
  const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
  setCategories(updatedCategories);

  const updatedProducts = products.map(p =>
    p.category === categoryToDelete ? { ...p, category: 'Sin categoría' } : p
  );
  setProducts(updatedProducts);
};

const handleEditCategory = async (oldCat: string, newCat: string) => {
  if (
    oldCat === 'Sin categoría' ||
    !newCat.trim() ||
    oldCat.trim() === newCat.trim()
  ) return;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (userError || !userId) {
    alert('Usuario no autenticado');
    return;
  }

  // 1. Actualizar categoría en la tabla categories
  const { error: updateCatError } = await supabase
    .from('categories')
    .update({ name: newCat.trim() })
    .eq('name', oldCat)
    .eq('user_id', userId);

  if (updateCatError) {
    console.error('Error actualizando categoría:', updateCatError.message);
    return;
  }

  // 2. Actualizar productos con la categoría vieja
  const { error: updateProdError } = await supabase
    .from('products')
    .update({ category: newCat.trim() })
    .eq('category', oldCat)
    .eq('user_id', userId);

  if (updateProdError) {
    console.error('Error actualizando productos:', updateProdError.message);
    return;
  }

  // 3. Refrescar categorías desde la base
  const { data: updatedCats, error: catFetchError } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', userId);

  if (catFetchError) {
    console.error('Error recargando categorías:', catFetchError.message);
  } else {
    const unique = Array.from(new Set(updatedCats.map(c => c.name)));
    setCategories(['Sin categoría', ...unique]);
  }

  // 4. Refrescar productos localmente
  const updatedProducts = products.map(p =>
    p.category === oldCat ? { ...p, category: newCat.trim() } : p
  );
  setProducts(updatedProducts);
};




  ;
;

const applyPriceUpdate = async () => {
  const newPrice = parseFloat(editingPrice);
  if (isNaN(newPrice) || !editingProductId) return;

  const originalProduct = products.find(p => p.id === editingProductId);
  if (!originalProduct) return;

  const prevOriginal = originalProduct.originalPrice ?? originalProduct.price;
  const showDiscount = prevOriginal > newPrice;

  const updatedProducts = products.map(p =>
    p.id === editingProductId
      ? {
          ...p,
          price: newPrice,
          originalPrice: showDiscount ? prevOriginal : undefined,
        }
      : p
  );
  setProducts(updatedProducts);

  await supabase
    .from('products')
    .update({
      price: newPrice,
      original_price: showDiscount ? prevOriginal : null,
    })
    .eq('id', editingProductId);

  setCartItems(prev =>
    prev.map(p =>
      p.id === editingProductId ? { ...p, price: newPrice } : p
    )
  );

  setEditingProductId(null);
  setEditingPrice('');
};


  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === '' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

if (!session) {
  return <Login onLogin={() => location.reload()} />;
}


return (
<main className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1c1c1c] to-[#111] text-white p-4 font-sans max-w-7xl mx-auto transition-all duration-500 ease-in-out">

{!showCartMobile && (
  <div className="fixed top-4 right-4 flex gap-3 z-50 animate-fade-in bg-gray-800/70 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg">
    {/* Botón para ADMINISTRACIÓN DE PRODUCTOS */}
    <button
      onClick={() => {
      setShowProductTable(true);
      setShowHistory(false);
      setSelectedSale(null);
      setShowCartMobile(false);
      setShowAddModal(false);
      setActiveCategory(''); // <--- AGREGÁ ESTO
      setSearchQuery('');    // <--- Y ESTO TAMBIÉN
      }}
      className="hover:scale-110 transition-transform"
    >
      <PlusCircle size={40} className="text-green-500 hover:text-green-600" />
    </button>

    {/* Botón para HISTORIAL */}
    <button
      onClick={() => {
        setShowHistory(true);
        setShowProductTable(false);
        setSelectedSale(null);
        setShowAddModal(false);
        setShowCartMobile(false);
      }}
      className="hover:scale-110 transition-transform"
    >
      <Clock size={40} className="text-blue-500 hover:text-blue-600" />
    </button>

    {/* Botón para VOLVER AL INICIO */}
    <button
      onClick={() => {
        setShowProductTable(false);
        setShowHistory(false);
        setSelectedSale(null);
        setShowCartMobile(false);
        setShowAddModal(false);
      }}
      className="hover:scale-110 transition-transform"
    >
      <Home size={40} className="text-gray-300 hover:text-white" />
    </button>
  </div>
)}


    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 pt-20">
      <div className="space-y-4">
        {showProductTable && (
          <>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-full shadow transition"
            >
              <PlusCircle size={18} /> Agregar producto
            </button>

            <div className="bg-[#0b1728]/80 backdrop-blur border border-gray-700 rounded-2xl shadow-lg p-6">
              <ProductListTable
                products={products}
                onDelete={async (id) => {
                  const updated = products.filter(p => p.id !== id);
                  setProducts(updated);
                  await supabase.from('products').delete().eq('id', id);
                }}
                onStartEditPrice={(id, price) => {
                  setEditingProductId(id);
                  setEditingPrice(price.toString());
                }}
                editingProductId={editingProductId}
                editingPrice={editingPrice}
                setEditingPrice={setEditingPrice}
                onApplyPriceUpdate={applyPriceUpdate}

                categories={categories}
                setProducts={setProducts}
                onAddToCart={addToCart} // ✅ esta es la que falta
                setEditingProductId={setEditingProductId}
                onDeleteCategory={handleDeleteCategory}
                onEditCategory={handleEditCategory}
                onUpdateProductCategory={async (id, newCategory) => {
                  const updated = products.map(p =>
                    p.id === id ? { ...p, category: newCategory } : p
                  );
                  setProducts(updated);
                  await supabase
                    .from('products')
                    .update({ category: newCategory })
                    .eq('id', id);
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
              <div className="bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl p-6 space-y-6">
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
                placeholder="🔍 Buscar productos..."
                className="w-full p-3 border border-gray-700 rounded-lg bg-[#0b1728] text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="bg-[#0b1728]/80 backdrop-blur border border-gray-700 rounded-2xl shadow-lg p-6 relative z-10">
<ProductListTable
  products={filteredProducts}
  onAddToCart={addToCart}
  onDelete={async (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    await supabase.from('products').delete().eq('id', id);
  }}
  onStartEditPrice={(id, price) => {
    setEditingProductId(id);
    setEditingPrice(price.toString());
  }}
  editingProductId={editingProductId}
  editingPrice={editingPrice}
  setEditingPrice={setEditingPrice}
onApplyPriceUpdate={applyPriceUpdate}
  categories={categories}
  setProducts={setProducts}
  setEditingProductId={setEditingProductId}
  onDeleteCategory={handleDeleteCategory}
  onEditCategory={handleEditCategory}
  onUpdateProductCategory={async (id, newCategory) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, category: newCategory } : p
    );
    setProducts(updated);
    await supabase.from('products').update({ category: newCategory }).eq('id', id);
  }}
  onOpenCategoryChange={(id) => {
    setCategoryProductId(id);
    setShowCategoryModal(true);
  }}
/>


</div>
          </>
        )}


{showAddModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
<AddProductModal
  categories={categories}
  onClose={() => setShowAddModal(false)}
  onAdd={(product) => {
    const updated = [...products, product];
    setProducts(updated);

    if (!categories.includes(product.category)) {
      const updatedCats = [...categories, product.category];
      setCategories(updatedCats);
    }

    setShowAddModal(false);
  }}
/>
    </div>
  </div>
)}



        {showHistory && (
          <div className="bg-[#0b1728]/80 backdrop-blur border border-gray-700 rounded-2xl shadow-lg p-6">
<SalesHistory
  onBack={() => setShowHistory(false)}
  onClear={() => setShowHistory(false)}
  onViewTicket={setSelectedSale}
  localName={confirmedStoreName}
/>


            
          </div>
        )}

        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
            <TicketView
              sale={selectedSale}
              onClose={() => setSelectedSale(null)}
              storeName={confirmedStoreName} // ✅ PASALO DESDE ACA
            />

            </div>
          </div>
        )}
       {showCategoryModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white border rounded-2xl shadow-lg p-6 max-w-md w-full">
      <CategoryChangeModal
        productId={categoryProductId}
        categories={categories}
        onClose={() => setShowCategoryModal(false)}
        onCategoryChange={async (newCategory) => {
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData?.user?.id;
          if (!userId) return;

          // Si la categoría no existe, la agregamos
          if (!categories.includes(newCategory)) {
            await supabase.from('categories').insert({ name: newCategory, user_id: userId });
            setCategories(prev => [...prev, newCategory]);
          }

          await supabase
            .from('products')
            .update({ category: newCategory })
            .eq('id', categoryProductId)
            .eq('user_id', userId);

          setProducts(prev =>
            prev.map(p =>
              p.id === categoryProductId ? { ...p, category: newCategory } : p
            )
          );
          setShowCategoryModal(false);
        }}
      />
    </div>
  </div>
)}
 
      </div>

{/* Carrito fijo para escritorio */}

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

onConfirm={async (sale) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Usuario no autenticado");
    return;
  }

  const { data: insertedSale, error } = await supabase
    .from("sales")
    .insert({
      user_id: user.id,
      items: sale.items,
      total: sale.total,
      discount: sale.discount,
    })
    .select()
    .single(); // 👈 trae directamente un solo objeto

  if (error || !insertedSale) {
    alert("Error al guardar venta: " + (error?.message || "Sin datos"));
    return;
  }

  // ✅ Seteamos la venta real con ID y fecha
  setSelectedSale(insertedSale);
  setShowHistory(false);
  setShowProductTable(false);
  setTimeout(() => setShowCartMobile(false), 500);
}}


    />
  </div>
)}


{!showHistory && !showProductTable && confirmedStoreName && (
  <button
    onClick={() => setShowCartMobile(true)}
    className="fixed bottom-4 right-4 bg-green-600 text-white w-12 h-12 p-2 rounded-full shadow-lg lg:hidden z-50 flex items-center justify-center"
  >
    🛒
    {cartItems.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
        {cartItems.length}
      </span>
    )}
  </button>
)}

<div
  className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${
    showCartMobile ? 'translate-x-0' : 'translate-x-full'
  } flex justify-end bg-black/40`}
>
  <div className="w-full max-w-sm h-full bg-[#0b1728] text-white shadow-lg p-4 overflow-y-auto">
    <button
      onClick={() => setShowCartMobile(false)}
      className="text-red-500 mb-4 font-semibold"
    >
      ✖ Cerrar
    </button>
    <Cart
      key="mobile"
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
      onConfirm={async (sale) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          alert("Usuario no autenticado");
          return;
        }

        const { data: insertedSale, error } = await supabase
          .from("sales")
          .insert({
            user_id: user.id,
            items: sale.items,
            total: sale.total,
            discount: sale.discount,
          })
          .select()
          .single();

        if (error || !insertedSale) {
          alert("Error al guardar venta: " + (error?.message || "Sin datos"));
          return;
        }

        setSelectedSale(insertedSale);
        setShowHistory(false);
        setShowProductTable(false);
        setTimeout(() => setShowCartMobile(false), 500);
      }}
    />
  </div>
</div>




      {!showHistory && !showProductTable && confirmedStoreName && (
        <>
          <button
            onClick={() => setShowCartMobile(true)}
            className="fixed bottom-4 right-4 bg-green-600 text-white w-12 h-12 p-2 rounded-full shadow-lg lg:hidden z-50 flex items-center justify-center"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                {cartItems.length}
              </span>
            )}
          </button>

{/* Carrito móvil, siempre montado y ocultado con clases */}


{!showHistory && !showProductTable && confirmedStoreName && (
  <div
    className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out transform ${
      showCartMobile ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } flex justify-end bg-black/40 backdrop-blur-sm`}
    onClick={() => setShowCartMobile(false)} // Cierra al tocar fuera del carrito
  >
    <div
      className="w-full max-w-sm h-full bg-[#0b1728] text-white shadow-lg p-4 overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Evita que clic dentro lo cierre
    >
      <button
        onClick={() => setShowCartMobile(false)}
        className="text-red-500 mb-4 font-semibold"
      >
        ✖ Cerrar
      </button>
      <Cart
        key="mobile"
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
        onConfirm={async (sale) => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            alert("Usuario no autenticado");
            return;
          }

          const { error } = await supabase.from("sales").insert({
            user_id: user.id,
            items: sale.items,
            total: sale.total,
            discount: sale.discount,
          });

          if (error) {
            alert("Error al guardar venta: " + error.message);
          } else {
            setSelectedSale(sale);
            setShowHistory(false);
            setShowProductTable(false);
            setShowCartMobile(false);
          }
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
  ;
}
