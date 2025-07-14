'use client';

import React from 'react';
import { Sale } from '../types';

interface TicketViewProps {
  sale: Sale;
  onClose: () => void;
  storeName: string;
}

export default function TicketView({ sale, onClose, storeName }: TicketViewProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const date = new Date(sale.created_at);
    const ticketNumber = sale.id?.slice(0, 8).toUpperCase() || Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

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
            .logo {
              display: block;
              margin: 0 auto 10px;
              max-width: 100px;
            }
          </style>
        </head>
        <body>
          <img src="/logo.png" alt="Logo" class="logo" />
          <h2>${storeName || 'Ticket de Compra'}</h2>
          <p>N° Ticket: ${ticketNumber}</p>
          <p>Fecha: ${date.toLocaleDateString()}</p>
          <p>Hora: ${date.toLocaleTimeString()}</p>
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

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 300);
    };
  };

  const date = new Date(sale.created_at);
  const ticketNumber = sale.id?.slice(0, 8).toUpperCase() || Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  return (
    <div className="text-sm font-mono motion-safe:animate-fade-in duration-300">
      <div className="bg-[#0b1728] text-white p-4 border border-gray-700 rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-2">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>
        <h2 className="text-center font-bold text-lg mb-2 text-blue-400">{storeName || 'Ticket de Compra'}</h2>
        <p className="text-center mb-1 text-gray-400">N° Ticket: {ticketNumber}</p>
        <p className="text-center mb-4 text-gray-300">
          Fecha: {date.toLocaleDateString()}<br />
          Hora: {date.toLocaleTimeString()}
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
          <p className="text-right mb-2 text-red-400">
            Descuento: -${sale.discount.toFixed(2)}
          </p>
        )}
        <p className="text-right font-bold text-lg text-green-400">
          Total: ${sale.total.toFixed(2)}
        </p>

        <div className="flex justify-between mt-4 print:hidden">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded transition hover:scale-105"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition hover:scale-105"
          >
            Imprimir ticket
          </button>
        </div>
      </div>
    </div>
  );
}
