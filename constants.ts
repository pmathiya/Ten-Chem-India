import { CompanyInfo, Product } from './types';

export const COMPANY_INFO: CompanyInfo = {
  name: "TenChem India",
  address: "At. Surendranagar, Gujarat, INDIA",
  phone: "+91-95587 35135",
  email: "tenchemindia@gmail.com",
  gst: "24ABCDE1234F1Z5" // Placeholder, keeping existing format
};

export const SAMPLE_PRODUCTS: Product[] = [
  // Adhesives
  { id: "NCA", name: "NCA SILVER - Polymer Modified Adhesive (20kg)", uom: "Bag", unitPrice: 100 },
  { id: "NSA", name: "NSA GOLD - Polymer Modified Adhesive (20kg)", uom: "Bag", unitPrice: 100 },
  { id: "EFA", name: "EFA PLATINUM - Extra Fix Adhesive (20kg)", uom: "Bag", unitPrice: 100 },
  { id: "VFA", name: "VFA DIAMOND - Vitro Fix Adhesive (20kg)", uom: "Bag", unitPrice: 100 },
  
  // Grouts
  { id: "TG-1", name: "Tile Grout - Polymer Based (1kg)", uom: "Bag", unitPrice: 100 },
  { id: "EG-1", name: "Epoxy Grout - Resin Based (1kg Kit)", uom: "Kit", unitPrice: 100 },
  { id: "EG-5", name: "Epoxy Grout - Resin Based (5kg Kit)", uom: "Kit", unitPrice: 100 },
  
  // Accessories
  { id: "TS-2", name: "Tile Spacer - 2mm (100 Pcs/Pkt)", uom: "Pkt", unitPrice: 100 },
  { id: "TS-3", name: "Tile Spacer - 3mm (100 Pcs/Pkt)", uom: "Pkt", unitPrice: 100 },
  { id: "TS-4", name: "Tile Spacer - 4mm (100 Pcs/Pkt)", uom: "Pkt", unitPrice: 100 },
  { id: "TE-KIT", name: "Tiles Equalizer (Levlar Kit) - 50 Clips/50 Wedges", uom: "Kit", unitPrice: 100 },
  { id: "TL-TOOL", name: "Tile Leveling Tool", uom: "Pc", unitPrice: 100 },
  { id: "TL-LIFT", name: "Tile Lifters (Suction Cup)", uom: "Pc", unitPrice: 100 },
  { id: "TRWL", name: "Trowel (Notched)", uom: "Pc", unitPrice: 100 },
];

export const INITIAL_CUSTOMER_DETAILS = {
  partyName: "",
  paymentTerms: 7,
  phoneNumber: ""
};