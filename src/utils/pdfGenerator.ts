import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DocumentGenerationOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

export class PDFGenerator {
  private static async captureElement(element: HTMLElement, options: DocumentGenerationOptions = {}) {
    // Apply print styles temporarily for optimal PDF rendering
    const originalStyles = element.style.cssText;
    const originalClassList = element.className;
    
    // Force print-optimized styling
    element.style.fontFamily = '"Times New Roman", serif';
    element.style.fontSize = '11pt';
    element.style.lineHeight = '1.4';
    element.style.color = '#000000';
    element.style.background = '#ffffff';
    element.style.width = '210mm'; // A4 width
    element.style.minHeight = '297mm'; // A4 height
    element.style.padding = '15mm 20mm 20mm 25mm';
    element.style.margin = '0';
    element.style.boxSizing = 'border-box';
    
    // Add print class for CSS targeting
    element.className += ' print-mode';
    
    // Apply print media styles programmatically
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      .print-mode * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    document.head.appendChild(printStyles);

    // Wait for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: options.quality || 4, // Ultra-high quality for legal documents
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      logging: false,
      foreignObjectRendering: true,
      removeContainer: false
    });

    // Restore original styles and classes
    element.style.cssText = originalStyles;
    element.className = originalClassList;
    document.head.removeChild(printStyles);

    return canvas;
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