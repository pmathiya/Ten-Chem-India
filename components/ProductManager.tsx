import React, { useState } from 'react';
import { X, Save, Trash2, Plus, Search, Edit2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Product } from '../types';

interface ProductManagerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  setProducts 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    uom: '',
    unitPrice: 0
  });

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  if (!isOpen) return null;

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.uom) {
      alert("Name and UOM are required");
      return;
    }

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      uom: newProduct.uom,
      unitPrice: newProduct.unitPrice || 0,
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', uom: '', unitPrice: 0 });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const saveEdit = () => {
    if (!editingId || !editForm.name) return;
    
    setProducts(products.map(p => 
      p.id === editingId ? { ...p, ...editForm } as Product : p
    ));
    setEditingId(null);
    setEditForm({});
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Updated to brand-dark */}
        <div className="bg-brand-dark px-6 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            Product Manager
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Add New */}
          <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-200 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Epoxy Grout"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Unit (UOM)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newProduct.uom}
                    onChange={e => setNewProduct({...newProduct, uom: e.target.value})}
                    placeholder="e.g. Bag"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-orange outline-none"
                    value={newProduct.unitPrice}
                    onChange={e => setNewProduct({...newProduct, unitPrice: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={handleAddProduct} className="w-full" icon={<Plus size={16}/>} variant="primary">
                Add to Catalog
              </Button>
            </div>
          </div>

          {/* Right Panel: List */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-slate-200 flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {products.length} Items
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Product Name</th>
                    <th className="px-3 py-2 text-left w-24">UOM</th>
                    <th className="px-3 py-2 text-right w-24">Price</th>
                    <th className="px-3 py-2 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-orange-50/50 group">
                      {editingId === product.id ? (
                        // Edit Mode
                        <>
                          <td className="p-2">
                            <input 
                              className="w-full p-1 border border-brand-orange rounded outline-none" 
                              value={editForm.name} 
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              autoFocus
                            />
                          </td>
                          <td className="p-2">
                             <input 
                              className="w-full p-1 border border-brand-orange rounded outline-none" 
                              value={editForm.uom} 
                              onChange={e => setEditForm({...editForm, uom: e.target.value})}
                            />
                          </td>
                          <td className="p-2">
                             <input 
                              type="number"
                              className="w-full p-1 border border-brand-orange rounded text-right outline-none" 
                              value={editForm.unitPrice} 
                              onChange={e => setEditForm({...editForm, unitPrice: parseFloat(e.target.value)})}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex justify-center gap-1">
                              <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <Save size={16} />
                              </button>
                              <button onClick={() => setEditingId(null)} className="p-1 text-slate-500 hover:bg-slate-100 rounded">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="p-3 text-slate-800 font-medium">{product.name}</td>
                          <td className="p-3 text-slate-500">{product.uom}</td>
                          <td className="p-3 text-right text-slate-700">₹{product.unitPrice}</td>
                          <td className="p-3 text-center">
                             <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                onClick={() => startEdit(product)}
                                className="text-brand-orange hover:text-orange-700" 
                                title="Edit">
                                 <Edit2 size={16} />
                               </button>
                               <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-600" 
                                title="Delete">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                     <tr>
                       <td colSpan={4} className="text-center py-8 text-slate-400">
                         No products found matching "{searchTerm}"
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <Button onClick={onClose} variant="secondary">Done</Button>
        </div>
      </div>
    </div>
  );
};