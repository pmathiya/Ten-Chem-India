import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyInfo, CustomerDetails, LineItem, QuoteTotals, Product } from '../types';

const BRAND_ORANGE = [234, 88, 12]; // #ea580c
const BRAND_DARK = [30, 41, 59];    // #1e293b

// Helper to draw the TenChem Logo
const drawLogo = (doc: jsPDF, x: number, y: number, scale: number = 0.5) => {
  doc.setFillColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  // Left Roof (Dark)
  doc.triangle(x + 25 * scale, y, x, y + 15 * scale, x + 15 * scale, y + 15 * scale, 'F'); 
  doc.rect(x + 15 * scale, y + 15 * scale, 10 * scale, 10 * scale, 'F');
  
  doc.setFillColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  // Right Roof (Orange)
  doc.triangle(x + 25 * scale, y, x + 50 * scale, y + 15 * scale, x + 35 * scale, y + 15 * scale, 'F');
  doc.rect(x + 30 * scale, y + 15 * scale, 10 * scale, 10 * scale, 'F'); // Actually right wall

  // Window Panes (White lines)
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1 * scale * 2);
  doc.line(x + 27.5 * scale, y + 15 * scale, x + 27.5 * scale, y + 25 * scale); // Vert
  doc.line(x + 22.5 * scale, y + 20 * scale, x + 32.5 * scale, y + 20 * scale); // Horiz

  // Logo Text
  doc.setFontSize(28 * scale * 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.text("TEN", x + 60 * scale, y + 22 * scale);
  doc.setTextColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.text("CHEM", x + 102 * scale, y + 22 * scale);
};

export const generateQuotePDF = (
  items: LineItem[],
  totals: QuoteTotals,
  customer: CustomerDetails,
  company: CompanyInfo,
  quoteNumber: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // --- Watermark ---
  doc.saveGraphicsState();
  doc.setTextColor(248, 248, 250); // Very light grey
  doc.setFontSize(100);
  doc.setFont('helvetica', 'bold');
  const watermarkText = "TEN CHEM";
  const wX = pageWidth / 2;
  const wY = pageHeight / 2;
  
  // Draw geometric shape behind text
  doc.setDrawColor(248, 248, 250);
  doc.setLineWidth(4);
  doc.triangle(wX - 80, wY + 20, wX, wY - 100, wX + 80, wY + 20, 'S');

  doc.text(watermarkText, wX, wY, { align: 'center', angle: 45, renderingMode: 'fill' });
  doc.restoreGraphicsState();

  // --- Page Border (Letterhead Box) ---
  doc.setDrawColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));

  // --- Header ---
  const logoX = margin + 8;
  const logoY = margin + 8;
  drawLogo(doc, logoX, logoY, 0.5);

  // Divider Line
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(margin + 5, logoY + 20, pageWidth - margin - 5, logoY + 20);

  // --- Info Block ---
  const startY = logoY + 30;
  doc.setFontSize(10);
  
  // Left: Company
  doc.setTextColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setFont('helvetica', 'bold');
  doc.text("FROM:", margin + 8, startY);
  
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name.toUpperCase(), margin + 8, startY + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(company.address, margin + 8, startY + 11);
  doc.text(`Ph: ${company.phone}`, margin + 8, startY + 16);
  doc.text(`Email: ${company.email}`, margin + 8, startY + 21);

  // Right: Customer
  const rightColX = pageWidth / 2 + 20;
  
  doc.setTextColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setFont('helvetica', 'bold');
  doc.text("BILL TO:", rightColX, startY);

  const partyName = customer.partyName.trim() || "Unknown";
  const partyPhone = customer.phoneNumber.trim() || "Not Provided";

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text(partyName, rightColX, startY + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Phone: ${partyPhone}`, rightColX, startY + 11);

  // Quote Metadata Box
  doc.setFillColor(255, 247, 237); // Orange-50
  doc.roundedRect(rightColX, startY + 18, 70, 20, 2, 2, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.text(`Quote No: ${quoteNumber}`, rightColX + 4, startY + 24);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, rightColX + 4, startY + 29);
  doc.text(`Valid Until: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, rightColX + 4, startY + 34);

  // --- Table ---
  const tableRows = items.map((item, index) => {
    const total = (item.quantity * item.unitPrice * (1 - item.discountPercent / 100));
    return [
      index + 1,
      item.productName,
      `${item.quantity} ${item.uom}`,
      item.unitPrice.toFixed(2),
      total.toFixed(2)
    ];
  });

  autoTable(doc, {
    startY: startY + 50,
    margin: { left: margin + 5, right: margin + 5 },
    head: [['#', 'Item Description', 'Qty / UOM', 'Unit Price', 'Total']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: BRAND_DARK,
      textColor: 255,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: 50
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right', fontStyle: 'bold' }
    }
  });

  // --- Totals Section ---
  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 10;
  const totalsW = 70;
  const totalsX = pageWidth - margin - 5 - totalsW;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  
  // Subtotal
  doc.text("Subtotal:", totalsX, finalY);
  doc.text(totals.subtotal.toFixed(2), pageWidth - margin - 8, finalY, { align: 'right' });

  // Discount
  if (totals.totalDiscount > 0) {
    doc.text("Discount:", totalsX, finalY + 6);
    doc.text(`-${totals.totalDiscount.toFixed(2)}`, pageWidth - margin - 8, finalY + 6, { align: 'right' });
    finalY += 6;
  }

  // Grand Total Line
  finalY += 4;
  doc.setDrawColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 5, finalY, pageWidth - margin - 5, finalY);
  
  finalY += 8;
  doc.setFontSize(14);
  doc.setTextColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setFont('helvetica', 'bold');
  doc.text("TOTAL:", totalsX, finalY);
  doc.text(totals.grandTotal.toFixed(2), pageWidth - margin - 8, finalY, { align: 'right' });

  // --- Terms & Conditions ---
  finalY += 25;
  if (finalY > pageHeight - 50) {
    doc.addPage();
    finalY = margin + 20;
    // Redraw border
    doc.setDrawColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
    doc.setLineWidth(0.8);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));
  }

  doc.setFontSize(10);
  doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.setFont('helvetica', 'bold');
  doc.text("TERMS & CONDITIONS:", margin + 8, finalY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  
  // Terms
  const terms = [
    `1. Payment: Strictly within ${customer.paymentTerms} days from invoice date.`,
    "2. GST: Extra as applicable.",
    "3. Late Payment: Interest @ 24% p.a. applicable on delayed payments.",
    "4. Price Validity: Prices subject to change without prior notice.",
    "5. Disputes: Subject to Surendranagar Jurisdiction only."
  ];

  let termY = finalY + 6;
  terms.forEach(term => {
    doc.text(term, margin + 8, termY);
    termY += 4;
  });

  // --- Footer ---
  const footerY = pageHeight - margin - 10;
  doc.setFillColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.rect(margin, footerY, pageWidth - (margin * 2), 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Thank you for your business!", pageWidth / 2, footerY + 6.5, { align: 'center', charSpace: 1 });

  doc.save(`Quote_${quoteNumber}_${partyName.replace(/\s+/g, '_')}.pdf`);
};

export const generateProductCatalogPDF = (products: Product[], company: CompanyInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Header
  doc.setDrawColor(BRAND_ORANGE[0], BRAND_ORANGE[1], BRAND_ORANGE[2]);
  doc.setLineWidth(2);
  doc.line(margin, margin + 15, pageWidth - margin, margin + 15);

  drawLogo(doc, margin, margin, 0.6);

  // Title
  doc.setFontSize(24);
  doc.setTextColor(BRAND_DARK[0], BRAND_DARK[1], BRAND_DARK[2]);
  doc.setFont('helvetica', 'bold');
  doc.text("PRODUCT CATALOG", pageWidth - margin, margin + 10, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Effective Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin + 18, { align: 'right' });

  // Company Contact Sub-header
  doc.setFontSize(9);
  doc.text(`${company.address} | ${company.phone} | ${company.email}`, margin, margin + 25);

  // Table
  const tableRows = products.map((p, i) => [
    i + 1,
    p.name,
    p.uom,
    p.unitPrice.toFixed(2)
  ]);

  autoTable(doc, {
    startY: margin + 30,
    head: [['#', 'Product Name', 'UOM', 'List Price (INR)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: BRAND_ORANGE,
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [255, 247, 237] // Light orange tint
    }
  });

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Prices are subject to change without notice. GST extra as applicable.", pageWidth / 2, footerY, { align: 'center' });

  doc.save('TenChem_Product_Catalog.pdf');
};

export const generateCompanyBrochurePDF = (company: CompanyInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // --- Page 1: Cover ---
  // Background
  doc.setFillColor(30, 41, 59); // Brand Dark
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Orange Accents
  doc.setFillColor(234, 88, 12); // Brand Orange
  doc.triangle(0, pageHeight, pageWidth, pageHeight, 0, pageHeight - 100, 'F');
  doc.triangle(pageWidth, 0, pageWidth, 100, pageWidth - 100, 0, 'F');

  // Logo (Centered, White)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(50);
  doc.setFont('helvetica', 'bold');
  doc.text("TEN", pageWidth/2 - 25, pageHeight/3, { align: 'right' });
  doc.setTextColor(234, 88, 12);
  doc.text("CHEM", pageWidth/2 - 25, pageHeight/3, { align: 'left' });

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("CONSTRUCTION", pageWidth/2, pageHeight/2, { align: 'center' });
  doc.text("CHEMICALS", pageWidth/2, pageHeight/2 + 12, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text("PORTFOLIO", pageWidth/2, pageHeight - 30, { align: 'center', charSpace: 5 });

  // --- Page 2: Vision & Mission ---
  doc.addPage();
  
  // Header Stripe
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageWidth, 40, 'F');
  drawLogo(doc, margin, 10, 0.4); // White-ish logo needed? using standard for now
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  
  let yPos = 60;
  
  // Vision
  doc.setTextColor(234, 88, 12);
  doc.text("Our Vision", margin, yPos);
  yPos += 10;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("Our vision is to become the foremost company providing innovative", margin, yPos);
  yPos += 6;
  doc.text("construction solutions to the building and construction industry.", margin, yPos);

  yPos += 30;

  // Mission
  doc.setTextColor(234, 88, 12);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text("Our Mission", margin, yPos);
  yPos += 10;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("We aspire to bring global construction technology to India and be your local", margin, yPos);
  yPos += 6;
  doc.text("partner for global construction products.", margin, yPos);

  // --- Page 3: Products (Simplified) ---
  doc.addPage();
  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, 15, pageHeight, 'F'); // Side stripe

  yPos = 30;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("PRODUCT RANGE", 25, yPos);

  yPos += 20;

  const products = [
    { title: "NCA SILVER", desc: "Polymer Modified Adhesive. Suitable For Fixing Of Ceramic, Glaze, Mosaic, Etc. Tiles For Flooring. Good Bonding Strength. Self-curing." },
    { title: "NSA GOLD", desc: "Polymer Modified Adhesive. Suitable For Fixing Of Vitrified, Ceramic, Glaze, Mosaic, Etc. Tiles For Flooring And Wall. High Polymer Modified." },
    { title: "EFA PLATINUM", desc: "Extra Fix Adhesive. Suitable For Fixing Of Marbles, Vetrified, Ceramic, Glaze, Mosaic, Etc. Tiles For Flooring, Wall ans Elevation." },
    { title: "VFA DIAMOND", desc: "Vitro Fix Adhesive. Polymer modified adhesive suitable for fixing of Marbles, stones and all types of tiles over wide range of Interior and Exterior surfaces." },
    { title: "TILE GROUT", desc: "Water resistant cementitous tile joint filler for all kinds of tiles. Effectively fills gaps and levels itself." },
    { title: "EPOXY GROUT", desc: "Resin based three part epoxy tile joint filler which exhibits stain resistant, chemical resistant, hard wearing & impervious properties." },
  ];

  products.forEach(p => {
    doc.setFontSize(14);
    doc.setTextColor(234, 88, 12);
    doc.setFont('helvetica', 'bold');
    doc.text(p.title, 25, yPos);
    
    yPos += 7;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(p.desc, pageWidth - 40);
    doc.text(splitDesc, 25, yPos);
    yPos += (splitDesc.length * 5) + 10;
  });

  doc.save('TenChem_Company_Catalog.pdf');
};

export const generateBusinessCardPDF = (company: CompanyInfo) => {
  // Matched to uploaded image style
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [89, 51]
  });

  const width = 89;
  const height = 51;

  // 1. Background (Light Grey as per image)
  doc.setFillColor(235, 235, 235); // Light greyish
  doc.rect(0, 0, width, height, 'F');

  // 2. Geometric Shapes (Orange geometric lines)
  doc.setDrawColor(200, 150, 100); // Muted orange/bronze
  doc.setLineWidth(1);
  
  // Top right shape (approx)
  doc.setFillColor(210, 180, 140); // Bronze-ish
  // Simulating the angled shape in top right
  
  // Bottom Left shape
  doc.setFillColor(210, 160, 120);
  // Drawing a shape similar to the image's "T" or angular bracket
  doc.setDrawColor(234, 88, 12); // Brand Orange
  doc.setLineWidth(2);
  // Abstract lines to mimic the modern design
  doc.line(0, height-15, 20, height-15);
  doc.line(20, height-15, 35, height);

  // 3. Logo (Top Left)
  drawLogo(doc, 5, 5, 0.3);

  // 4. "TENCHEM INDIA" Text
  const contentX = width - 5;
  const bottomY = height - 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59); // Dark
  doc.text("TENCHEM INDIA", contentX, 32, { align: 'right' });
  
  // Orange vertical bar next to text
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.5);
  doc.line(contentX - 45, 30, contentX - 45, 45); // Vertical separator

  // 5. Contact Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(60, 60, 60);
  
  // Icons simulated with simple shapes or just text indentation
  const infoX = contentX; 
  
  doc.text("At. Surendranagar, Gujarat, INDIA.", infoX, 36, { align: 'right' });
  doc.text("+91-95587 35135", infoX, 39, { align: 'right' });
  doc.text("tenchemindia@gmail.com", infoX, 42, { align: 'right' });

  doc.save('TenChem_Business_Card.pdf');
};