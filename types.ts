export interface Product {
  id: string;
  name: string;
  uom: string;
  unitPrice: number;
}

export interface LineItem {
  id: string; // Unique ID for the row
  productId: string;
  productName: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
}

export interface QuoteTotals {
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
}

export interface CustomerDetails {
  partyName: string;
  paymentTerms: number;
  phoneNumber: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst: string;
}