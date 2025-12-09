import React, { useState } from 'react';
import { X, FileDown } from 'lucide-react';
import { Button } from './ui/Button';
import { CustomerDetails } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: CustomerDetails) => void;
  initialDetails: CustomerDetails;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialDetails 
}) => {
  const [details, setDetails] = useState<CustomerDetails>(initialDetails);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-dark px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <FileDown size={20} className="text-brand-orange" />
            Finalize Quotation
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Party / Business Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme Construction Ltd."
              value={details.partyName}
              onChange={(e) => setDetails({...details, partyName: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-1">Leave blank for "Unknown"</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              placeholder="+91 XXXXX XXXXX"
              value={details.phoneNumber}
              onChange={(e) => setDetails({...details, phoneNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Terms (Days)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              value={details.paymentTerms}
              onChange={(e) => setDetails({...details, paymentTerms: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};