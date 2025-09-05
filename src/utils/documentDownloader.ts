import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } from 'docx';

export interface DownloadOptions {
  filename?: string;
  quality?: number;
  format?: 'jpg' | 'png' | 'pdf' | 'docx';
  width?: number;
  height?: number;
}

export class DocumentDownloader {
  
  /**
   * Download contract as high-quality JPG image
   */
  static async downloadAsJPG(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      const canvas = await this.captureElementAsCanvas(element, { 
        ...options, 
        backgroundColor: '#ffffff',
        scale: 2 // High quality
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, options.filename || 'contract.jpg');
        }
      }, 'image/jpeg', options.quality || 0.95);
    } catch (error) {
      console.error('Error downloading as JPG:', error);
      throw new Error('Failed to generate JPG');
    }
  }

  /**
   * Download contract as high-quality PNG image
   */
  static async downloadAsPNG(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      const canvas = await this.captureElementAsCanvas(element, { 
        ...options, 
        backgroundColor: '#ffffff',
        scale: 2 // High quality
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, options.filename || 'contract.png');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading as PNG:', error);
      throw new Error('Failed to generate PNG');
    }
  }

  /**
   * Open browser print dialog for PDF generation
   */
  static async downloadAsPrintPDF(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Clone the element and its styles
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create print-optimized HTML
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${options.filename || 'Contract'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: "Times New Roman", serif; 
              font-size: 11pt; 
              line-height: 1.4; 
              color: black;
              background: white;
            }
            .page-break-before { page-break-before: always; }
            .page-break-after { page-break-after: always; }
            .no-page-break { page-break-inside: avoid; }
            table { page-break-inside: avoid; }
            .repayment-schedule { page-break-inside: avoid; }
            
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .signature-section { page-break-before: always; }
              .contract-section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
        </html>
      `;

      printWindow.document.write(printHTML);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };
    } catch (error) {
      console.error('Error opening print dialog:', error);
      throw new Error('Failed to open print dialog');
    }
  }

  /**
   * Download contract as Word document (DOCX)
   */
  static async downloadAsDOCX(contractData: any, options: DownloadOptions = {}): Promise<void> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "EDUCATION LOAN AGREEMENT",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            
            new Paragraph({ text: "" }), // Empty line
            
            // Contract parties
            new Paragraph({
              text: "BETWEEN",
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 400 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `${contractData.lenderName}`,
                  bold: true
                }),
                new TextRun({
                  text: " (The Lender)",
                  break: 1
                })
              ]
            }),
            
            new Paragraph({
              text: "AND",
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 400 }
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `${contractData.borrowerName}`,
                  bold: true
                }),
                new TextRun({
                  text: " (The Borrower)",
                  break: 1
                })
              ]
            }),

            new Paragraph({ text: "" }), // Empty line
            
            // Key terms
            new Paragraph({
              text: "KEY LOAN TERMS",
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Loan Amount: ", bold: true }),
                new TextRun({ text: `£${contractData.loanAmount}` })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Interest Rate: ", bold: true }),
                new TextRun({ text: `${contractData.interestRate}% APR` })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Loan Term: ", bold: true }),
                new TextRun({ text: `${contractData.loanTerm} months` })
              ]
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Monthly Payment: ", bold: true }),
                new TextRun({ text: `£${contractData.installmentAmount}` })
              ]
            }),

            new Paragraph({ text: "" }), // Empty line
            
            // Agreement date and signatures placeholder
            new Paragraph({
              text: "SIGNATURES",
              heading: HeadingLevel.HEADING_1,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ text: "Agreement Date: ", bold: true }),
                new TextRun({ text: contractData.agreementDate })
              ]
            }),
            
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Borrower Signature: _________________________" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Lender Representative: _________________________" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Date: _________________________" }),
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      this.downloadBlob(blob, options.filename || 'contract.docx');
    } catch (error) {
      console.error('Error downloading as DOCX:', error);
      throw new Error('Failed to generate Word document');
    }
  }

  /**
   * Capture HTML element as high-quality canvas
   */
  private static async captureElementAsCanvas(element: HTMLElement, options: any = {}): Promise<HTMLCanvasElement> {
    // Ensure element is visible and properly rendered
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    
    element.style.display = 'block';
    element.style.visibility = 'visible';
    
    // Wait for fonts and layout to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: options.backgroundColor || '#ffffff',
        scale: options.scale || 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        height: options.height || element.scrollHeight,
        width: options.width || element.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        // Handle web fonts properly
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(element.id);
          if (clonedElement) {
            // Ensure all styles are applied
            clonedElement.style.transform = 'none';
            clonedElement.style.webkitTransform = 'none';
          }
        }
      });
      
      return canvas;
    } finally {
      // Restore original styles
      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
    }
  }

  /**
   * Download blob as file
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Get available download formats with their descriptions
   */
  static getAvailableFormats() {
    return [
      {
        format: 'png' as const,
        label: 'PNG Image',
        description: 'High-quality image (recommended)',
        icon: '🖼️'
      },
      {
        format: 'jpg' as const,
        label: 'JPG Image', 
        description: 'Compressed image format',
        icon: '📸'
      },
      {
        format: 'pdf' as const,
        label: 'Print to PDF',
        description: 'Use browser\'s print function',
        icon: '🖨️'
      },
      {
        format: 'docx' as const,
        label: 'Word Document',
        description: 'Editable document format',
        icon: '📝'
      }
    ];
  }
}