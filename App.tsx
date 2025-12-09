import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Database, FileText, UserSquare2, BookOpen, Download } from 'lucide-react';
import { ProductUploader } from './components/ProductUploader';
import { QuoteTable } from './components/QuoteTable';
import { CustomerModal } from './components/CustomerModal';
import { ProductManager } from './components/ProductManager';
import { Button } from './components/ui/Button';
import { COMPANY_INFO, INITIAL_CUSTOMER_DETAILS, SAMPLE_PRODUCTS } from './constants';
import { LineItem, Product, QuoteTotals, CustomerDetails } from './types';
import { generateQuotePDF, generateProductCatalogPDF, generateBusinessCardPDF, generateCompanyBrochurePDF } from './services/pdfService';

// Inline Logo Component to match the TenChem brand
const TenChemLogo = () => (
  <svg width="48" height="32" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    {/* Dark Roof Left */}
    <path d="M30 0L5 15H15V25H25V15H30Z" fill="#1e293b"/>
    {/* Orange Roof Right */}
    <path d="M30 0L55 15H45V25H35V15H30Z" fill="#ea580c"/>
    {/* Windows */}
    <rect x="26" y="27" width="8" height="8" fill="#1e293b" />
    <rect x="26" y="27" width="3.5" height="3.5" fill="white" />
    <rect x="30.5" y="27" width="3.5" height="3.5" fill="white" />
    <rect x="26" y="31.5" width="3.5" height="3.5" fill="white" />
    <rect x="30.5" y="31.5" width="3.5" height="3.5" fill="white" />
  </svg>
);

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(INITIAL_CUSTOMER_DETAILS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);

  // Real-time calculation using useMemo
  const totals: QuoteTotals = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;

    lineItems.forEach(item => {
      const grossPrice = item.quantity * item.unitPrice;
      const discountAmount = grossPrice * (item.discountPercent / 100);
      
      subtotal += grossPrice;
      totalDiscount += discountAmount;
    });

    return {
      subtotal,
      totalDiscount,
      grandTotal: subtotal - totalDiscount
    };
  }, [lineItems]);

  const handleGeneratePDF = (finalDetails: CustomerDetails) => {
    setCustomerDetails(finalDetails);
    setIsModalOpen(false);
    
    // Generate Random Quote Number
    const quoteNum = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    generateQuotePDF(lineItems, totals, finalDetails, COMPANY_INFO, quoteNum);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Top Header */}
      <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TenChemLogo />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-brand-dark leading-none">
                TEN <span className="text-brand-orange">CHEM</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-1">Quotation Generator</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
             <div className="text-xs font-semibold text-brand-orange">Customer Care</div>
             <div className="text-sm font-bold text-slate-700">{COMPANY_INFO.phone}</div>
          </div>
        </div>
      </header>

      {/* Hero / Banner Strip */}
      <div className="bg-brand-dark text-white py-8 relative overflow-hidden">
        {/* Abstract geometric background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Construction Chemicals</h2>
          <p className="text-orange-100 max-w-2xl">
            Streamlined proposal generation for our range of polymer modified adhesives, grouts, and tile accessories.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6 -mt-8 relative z-20">
        
        {/* Controls Row */}
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-brand-orange flex flex-col xl:flex-row gap-6 justify-between items-center">
          
          <div className="flex flex-col lg:flex-row gap-6 w-full xl:w-auto items-start lg:items-center">
            
            {/* Group 1: Product Management */}
            <div className="flex gap-2 w-full lg:w-auto">
              <ProductUploader onProductsLoaded={setProducts} className="flex-1 md:flex-none" />
              <Button 
                variant="outline" 
                onClick={() => setIsProductManagerOpen(true)}
                icon={<Settings size={16} />}
                className="flex-1 md:flex-none"
              >
                Manage Products
              </Button>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block h-8 w-px bg-slate-200"></div>

            {/* Group 2: Downloads */}
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 sm:mb-0 sm:mr-2 flex items-center min-w-fit">
                  Downloads:
                </span>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="soft"
                        size="sm"
                        onClick={() => generateProductCatalogPDF(products, COMPANY_INFO)}
                        icon={<FileText size={14} />}
                        title="Download Product Price List"
                        className="flex-1 sm:flex-none"
                    >
                        Product Catalog
                    </Button>
                    <Button
                        variant="soft"
                        size="sm"
                        onClick={() => generateCompanyBrochurePDF(COMPANY_INFO)}
                        icon={<BookOpen size={14} />}
                        title="Download Company Brochure"
                        className="flex-1 sm:flex-none"
                    >
                        Company Catalog
                    </Button>
                    <Button
                        variant="soft"
                        size="sm"
                        onClick={() => generateBusinessCardPDF(COMPANY_INFO)}
                        icon={<UserSquare2 size={14} />}
                        title="Download Business Card"
                        className="flex-1 sm:flex-none"
                    >
                        Business Card
                    </Button>
                </div>
            </div>
          </div>
          
          {/* Main Action */}
          <div className="w-full xl:w-auto mt-4 xl:mt-0">
             <Button 
               variant="primary" 
               size="lg" 
               className="w-full xl:w-auto shadow-lg shadow-orange-200"
               disabled={lineItems.length === 0}
               onClick={() => setIsModalOpen(true)}
             >
               Generate Quote PDF
             </Button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="h-[600px] flex flex-col shadow-xl rounded-lg overflow-hidden border border-slate-200">
           <QuoteTable 
             products={products} 
             lineItems={lineItems} 
             setLineItems={setLineItems}
             totals={totals}
           />
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-xs">
        <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
        <p className="mt-1">Mfg. & Mktd. By: {COMPANY_INFO.name}, {COMPANY_INFO.address}</p>
      </footer>

      {/* Modals */}
      <CustomerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGeneratePDF}
        initialDetails={customerDetails}
      />

      <ProductManager 
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        products={products}
        setProducts={setProducts}
      />

    </div>
  );
};

export default App;