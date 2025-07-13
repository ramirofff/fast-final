'use client';

interface Props {
  cart: { name: string; price: number }[];
  onClose: () => void;
}

export default function Receipt({ cart, onClose }: Props) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-gray-900 text-gray-100 p-6 print:p-0 print:bg-white z-50 flex flex-col items-center justify-start">
      <div className="max-w-sm w-full text-center border border-gray-700 bg-gray-800 rounded-xl p-6 shadow-lg print:border-0 print:bg-white print:text-black print:mt-6">
        <h2 className="text-2xl font-bold mb-2">🧾 Ticket de Compra</h2>
        <p className="text-sm text-gray-400 mb-4">Gestión de ventas </p>
        <ul className="text-left mb-4 divide-y divide-gray-700 print:divide-black">
          {cart.map((item, idx) => (
            <li key={idx} className="flex justify-between py-1">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="font-bold text-lg mb-4">Total: ${total.toFixed(2)}</div>

        <div className="print:hidden flex justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
