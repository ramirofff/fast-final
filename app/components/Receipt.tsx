
"use client";

interface Props {
  cart: { name: string; price: number }[];
  onClose: () => void;
}

export default function Receipt({ cart, onClose }: Props) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-white text-black p-6 print:p-0 print:bg-white z-50 flex flex-col items-center justify-start">
      <div className="max-w-sm w-full text-center border border-gray-300 p-4 print:border-0 print:mt-4">
        <h2 className="text-xl font-bold mb-2">🧾 Ticket de Compra</h2>
        <p className="text-sm mb-4">FastFood Store - Personaliza aquí tu local</p>
        <ul className="text-left mb-4">
          {cart.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.name}</span> <span>${item.price}</span>
            </li>
          ))}
        </ul>
        <div className="font-bold text-lg mb-4">Total: ${total}</div>
        <div className="print:hidden flex justify-center gap-4">
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">🖨️ Imprimir</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
