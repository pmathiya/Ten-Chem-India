import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { LineItem, Product, QuoteTotals } from '../types';
import { Button } from './ui/Button';

interface QuoteTableProps {
  products: Product[];
  lineItems: LineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
  totals: QuoteTotals;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({ 
  products, 
  lineItems, 
  setLineItems,
  totals 
}) => {
  
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: '',
      productName: '',
      uom: '-',
      quantity: 1,
      unitPrice: 0,
      discountPercent: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id !== id) return item;

      // Handle Product Selection
      if (field === 'productId') {
        const product = products.find(p => p.id === value);
        if (product) {
          return {
            ...item,
            productId: product.id,
            productName: product.name,
            uom: product.uom,
            unitPrice: product.unitPrice
          };
        }
      }

      return { ...item, [field]: value };
    }));
  };

  return (
    <div className="bg-white rounded-lg flex flex-col h-full">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 bg-brand-dark p-3 text-xs font-semibold text-white uppercase tracking-wider">
        <div className="col-span-4 md:col-span-5 pl-2">Item Description</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-center">Disc %</div>
        <div className="col-span-2 md:col-span-1 text-right pr-2">Total</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-slate-50">
        {lineItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <p>Your quotation is empty.</p>
            <p className="text-sm">Click "Add Item" to begin.</p>
          </div>
        )}
        
        {lineItems.map((item) => {
          const lineTotal = (item.quantity * item.unitPrice) * (1 - item.discountPercent / 100);
          
          return (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded shadow-sm border border-slate-200 hover:border-brand-orange/50 transition-colors">
              
              {/* Product Selection */}
              <div className="col-span-4 md:col-span-5">
                <select
                  className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none bg-white"
                  value={item.productId}
                  onChange={(e) => updateLineItem(item.id, 'productId', e.target.value)}
                >
                  <option value="">Select Product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="text-[10px] text-brand-orange font-medium mt-1 md:hidden truncate">{item.uom}</div>
              </div>

              {/* Quantity */}
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-slate-300 rounded text-sm text-center focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                />
                <div className="text-[10px] text-center text-slate-400 hidden md:block mt-0.5">{item.uom}</div>
              </div>

              {/* Unit Price */}
              <div className="col-span-2 text-right">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded text-sm text-slate-600 font-mono">
                  {item.unitPrice.toFixed(0)}
                </div>
              </div>

              {/* Discount */}
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-2 border border-slate-300 rounded text-sm text-center focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  value={item.discountPercent}
                  onChange={(e) => updateLineItem(item.id, 'discountPercent', parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* Line Total & Delete */}
              <div className="col-span-2 md:col-span-1 flex items-center justify-end gap-2">
                 <div className="text-sm font-bold text-slate-800 tabular-nums">
                   {lineTotal.toFixed(0)}
                 </div>
                 <button 
                  onClick={() => removeLineItem(item.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Remove Item"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Controls & Summary */}
      <div className="bg-white p-4 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <Button onClick={addLineItem} icon={<Plus size={18} />} variant="secondary">
            Add New Item
          </Button>

          <div className="w-full md:w-auto bg-slate-50 p-4 rounded-lg border border-slate-200 min-w-[300px]">
            <div className="flex justify-between items-center text-sm text-slate-600 mb-1">
              <span>Subtotal:</span>
              <span>₹ {totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.totalDiscount > 0 && (
              <div className="flex justify-between items-center text-sm text-orange-600 mb-2">
                <span>Discount:</span>
                <span>- ₹ {totals.totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xl font-bold text-brand-dark">
              <span>Grand Total:</span>
              <span>₹ {totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};