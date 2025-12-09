import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/Button';

interface ProductUploaderProps {
  onProductsLoaded: (products: Product[]) => void;
  className?: string;
}

export const ProductUploader: React.FC<ProductUploaderProps> = ({ onProductsLoaded, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedProducts: Product[] = results.data.map((row: any) => ({
          id: row.ProductID || row.id || Math.random().toString(36).substr(2, 9),
          name: row.ProductName || row.name || 'Unknown Product',
          uom: row.UnitOfMeasure || row.uom || 'Unit',
          unitPrice: parseFloat(row.UnitPrice || row.price || '0'),
        })).filter(p => !isNaN(p.unitPrice));

        if (parsedProducts.length > 0) {
          onProductsLoaded(parsedProducts);
        } else {
          alert('No valid products found in CSV. Please check the format.');
        }
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        alert('Error parsing CSV file.');
      }
    });
  };

  return (
    <>
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />
      <Button 
        variant="outline" 
        icon={<Upload size={16} />} 
        onClick={() => fileInputRef.current?.click()}
        className={`h-full ${className}`}
      >
        Import CSV
      </Button>
    </>
  );
};