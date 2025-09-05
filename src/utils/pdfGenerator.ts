import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DocumentGenerationOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

export class PDFGenerator {
  private static async captureElement(element: HTMLElement, options: DocumentGenerationOptions = {}): Promise<HTMLCanvasElement> {
    // Wait for any dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a temporary container for the element to isolate PDF styling
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.fontFamily = '"Times New Roman", serif';
    tempContainer.style.fontSize = '11pt';
    tempContainer.style.lineHeight = '1.4';
    tempContainer.style.color = '#000000';
    tempContainer.style.padding = '15mm 20mm 20mm 25mm';
    tempContainer.style.margin = '0';
    tempContainer.style.boxSizing = 'border-box';
    
    // Clone the element to avoid affecting the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Apply PDF-specific styles recursively to the cloned element
    const applyPDFStyles = (el: HTMLElement) => {
      // Ensure proper print colors and formatting
      el.style.color = '#000000';
      el.style.backgroundColor = '#ffffff';
      (el.style as any).webkitPrintColorAdjust = 'exact';
      
      // Handle specific element types
      if (el.tagName === 'TABLE') {
        el.style.borderCollapse = 'collapse';
        el.style.width = '100%';
        el.style.marginBottom = '1rem';
      }
      
      if (el.tagName === 'TH' || el.tagName === 'TD') {
        el.style.border = '1px solid #000000';
        el.style.padding = '8px';
        el.style.fontSize = '9pt';
        el.style.verticalAlign = 'top';
      }
      
      if (el.classList.contains('currency')) {
        el.style.textAlign = 'right';
        el.style.fontFamily = 'monospace';
      }
      
      if (el.classList.contains('signature-block')) {
        el.style.marginTop = '2rem';
        el.style.pageBreakInside = 'avoid';
        el.style.border = '1px solid #ccc';
        el.style.padding = '1rem';
      }
      
      if (el.classList.contains('contract-section')) {
        el.style.marginBottom = '1.5rem';
        el.style.pageBreakInside = 'avoid';
      }
      
      if (el.classList.contains('page-break-after')) {
        el.style.pageBreakAfter = 'always';
      }
      
      if (el.classList.contains('no-page-break')) {
        el.style.pageBreakInside = 'avoid';
      }
      
      // Apply styles to all children
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          applyPDFStyles(child);
        }
      });
    };
    
    // Apply styles to the cloned element
    applyPDFStyles(clonedElement);
    
    // Add the cloned element to the temporary container
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const canvas = await html2canvas(clonedElement, {
        scale: options.quality || 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        logging: false,
        foreignObjectRendering: true,
        imageTimeout: 0,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in the cloned document
          const fontLink = document.createElement('link');
          fontLink.href = 'https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap';
          fontLink.rel = 'stylesheet';
          clonedDoc.head.appendChild(fontLink);
        }
      });
      
      return canvas;
    } finally {
      // Clean up the temporary container
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  }

  static async generateFromElement(
    element: HTMLElement, 
    options: DocumentGenerationOptions = {}
  ): Promise<jsPDF> {
    const canvas = await this.captureElement(element, options);
    
    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
    
    // Create PDF with proper A4 dimensions and metadata
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // No compression for legal documents
      putOnlyUsedFonts: true,
      floatPrecision: 16
    });

    // Add document metadata
    pdf.setProperties({
      title: 'Education Loan Agreement',
      subject: 'Legal Contract Document',
      author: 'TechSkillUK Ltd',
      creator: 'TechSkillUK Loan Platform',
      keywords: 'education loan, legal agreement, contract'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm for A4
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm for A4
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Professional document margins
    const topMargin = 15;
    const bottomMargin = 20; 
    const leftMargin = 25;
    const rightMargin = 20;
    
    const availableWidth = pdfWidth - leftMargin - rightMargin;
    const availableHeight = pdfHeight - topMargin - bottomMargin;
    
    // Calculate optimal scaling maintaining aspect ratio
    const pixelsToMm = 0.264583;
    const imgWidthMm = imgWidth * pixelsToMm;
    const imgHeightMm = imgHeight * pixelsToMm;
    
    const widthRatio = availableWidth / imgWidthMm;
    const heightRatio = availableHeight / imgHeightMm;
    const optimalRatio = Math.min(widthRatio, heightRatio, 1); // Don't scale up
    
    const finalWidth = imgWidthMm * optimalRatio;
    const finalHeight = imgHeightMm * optimalRatio;
    
    // Center horizontally, start from top margin
    const imgX = leftMargin + (availableWidth - finalWidth) / 2;
    const imgY = topMargin;

    // Enhanced multi-page handling for legal documents
    const usablePageHeight = availableHeight;
    let currentY = imgY;
    let remainingHeight = finalHeight;
    let sourceY = 0;
    let pageNumber = 1;

    while (remainingHeight > 0) {
      if (pageNumber > 1) {
        pdf.addPage();
        currentY = topMargin;
      }
      
      const currentPageHeight = Math.min(remainingHeight, usablePageHeight);
      const sourceHeight = (currentPageHeight / finalHeight) * imgHeight;
      
      // Create high-quality page section
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.ceil(sourceHeight);
      const pageCtx = pageCanvas.getContext('2d');
      
      if (pageCtx) {
        // Enable high-quality rendering
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';
        
        pageCtx.drawImage(
          canvas, 
          0, Math.floor(sourceY), 
          imgWidth, Math.ceil(sourceHeight),
          0, 0, 
          imgWidth, Math.ceil(sourceHeight)
        );
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        
        // Add image to PDF with precise positioning
        pdf.addImage(
          pageImgData, 
          'PNG', 
          imgX, 
          currentY, 
          finalWidth, 
          currentPageHeight,
          undefined, // alias
          'FAST' // compression mode
        );
        
        // Add page number footer (except first page)
        if (pageNumber > 1) {
          pdf.setFontSize(9);
          pdf.setFont('times', 'normal');
          pdf.text(
            `Page ${pageNumber}`, 
            pdfWidth - rightMargin - 15, 
            pdfHeight - 10
          );
        }
      }
      
      sourceY += sourceHeight;
      remainingHeight -= currentPageHeight;
      pageNumber++;
    }
    
    return pdf;
  }

  static async downloadFromElement(
    element: HTMLElement, 
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const pdf = await this.generateFromElement(element, options);
    const filename = options.filename || `document-${Date.now()}.pdf`;
    pdf.save(filename);
  }

  static async generateLegalContract(
    element: HTMLElement,
    contractData: {
      contractId: string;
      contractType: string;
      borrowerName?: string;
      loanAmount: number;
    },
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const filename = options.filename || 
      `legal-contract-${contractData.contractType}-${contractData.contractId.slice(0, 8)}.pdf`;
    
    await this.downloadFromElement(element, {
      ...options,
      filename,
      format: 'a4',
      orientation: 'portrait',
      quality: 3 // Maximum quality for legal documents
    });
  }

  static async generateOfferDocument(
    element: HTMLElement,
    offerData: {
      loanAmount: number;
      offerType: string;
      borrowerName?: string;
      offerId: string;
    },
    options: DocumentGenerationOptions = {}
  ): Promise<void> {
    const filename = options.filename || 
      `loan-offer-${offerData.offerType}-${offerData.offerId.slice(0, 8)}.pdf`;
    
    await this.downloadFromElement(element, {
      ...options,
      filename,
      format: 'a4',
      orientation: 'portrait'
    });
  }
}