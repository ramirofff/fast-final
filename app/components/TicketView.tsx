import { useEffect } from 'react';
import { Sale } from '../types';

interface TicketViewProps {
  sale: Sale;
  onClose: () => void;
}

export default function TicketView({ sale, onClose }: TicketViewProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Ticket de Compra</title>
          <style>
            body {
              font-family: monospace;
              padding: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 10px;
            }
            p, table {
              margin: 0 auto;
              max-width: 300px;
            }
            table {
              width: 100%;
              margin-top: 10px;
              border-collapse: collapse;
            }
            th, td {
              padding: 4px;
              text-align: left;
            }
            th {
              border-bottom: 1px solid #000;
            }
            td:last-child, th:last-child {
              text-align: right;
            }
            .total {
              text-align: right;
              margin-top: 12px;
              font-weight: bold;
              font-size: 1.1em;
            }
          </style>
        </head>
        <body>
          <h2>Ticket de Compra</h2>
          <p>Fecha: ${new Date(sale.timestamp).toLocaleDateString()}</p>
          <p>Hora: ${new Date(sale.timestamp).toLocaleTimeString()}</p>
          <table>
            <thead>
              <tr><th>Producto</th><th>Precio</th></tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>$${item.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ${sale.discount > 0 ? `<p class="total">Descuento: -$${sale.discount.toFixed(2)}</p>` : ''}
          <p class="total">Total: $${sale.total.toFixed(2)}</p>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();

    // Esperar a que cargue antes de imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 300); // Le da tiempo para renderizar antes de imprimir
    };
  };

  return (
    <div className="text-sm font-mono">
      <div className="bg-white p-4 border rounded shadow w-full max-w-sm mx-auto">
        <h2 className="text-center font-bold text-lg mb-2">Ticket de Compra</h2>
        <p className="text-center mb-4">
          Fecha: {new Date(sale.timestamp).toLocaleDateString()}<br />
          Hora: {new Date(sale.timestamp).toLocaleTimeString()}
        </p>
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th className="border-b pb-1">Producto</th>
              <th className="border-b pb-1 text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index}>
                <td className="py-1">{item.name}</td>
                <td className="py-1 text-right">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sale.discount > 0 && (
          <p className="text-right mb-2">Descuento: -${sale.discount.toFixed(2)}</p>
        )}
        <p className="text-right font-bold text-lg">Total: ${sale.total.toFixed(2)}</p>

        <div className="flex justify-between mt-4 print:hidden">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Imprimir ticket
          </button>
        </div>
      </div>
    </div>
  );
}
