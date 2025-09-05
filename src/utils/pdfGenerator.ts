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
    // Wait for fonts and layout to stabilize
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ensure the element is visible and properly rendered
    const originalPosition = element.style.position;
    const originalVisibility = element.style.visibility;
    
    // Temporarily ensure element is visible for capture
    element.style.visibility = 'visible';
    element.style.position = 'relative';
    
    try {
      // Get the bounding box to ensure we capture the full element
      const rect = element.getBoundingClientRect();
      
      const canvas = await html2canvas(element, {
        scale: options.quality || 2, // High quality but not excessive
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        width: element.scrollWidth || rect.width,
        height: element.scrollHeight || rect.height,
        logging: false,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        removeContainer: false,
        ignoreElements: (element) => {
          // Skip elements that might interfere with PDF rendering
          return element.classList?.contains('no-pdf') || 
                 element.tagName === 'SCRIPT' ||
                 element.tagName === 'NOSCRIPT';
        },
        onclone: async (clonedDoc, element) => {
          // Ensure all fonts are loaded in the cloned document
          const existingFonts = Array.from(document.fonts);
          const fontPromises = existingFonts.map(font => font.load());
          
          try {
            await Promise.all(fontPromises);
          } catch (error) {
            console.warn('Some fonts failed to load:', error);
          }
          
          // Copy all stylesheets to the cloned document
          const stylesheets = Array.from(document.styleSheets);
          stylesheets.forEach(sheet => {
            try {
              const link = clonedDoc.createElement('link');
              link.rel = 'stylesheet';
              link.href = (sheet as any).href || '';
              if (link.href) {
                clonedDoc.head.appendChild(link);
              }
            } catch (error) {
              console.warn('Could not copy stylesheet:', error);
            }
          });
          
          // Wait for styles to apply
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      });
      
      return canvas;
    } finally {
      // Restore original styles
      element.style.position = originalPosition;
      element.style.visibility = originalVisibility;
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