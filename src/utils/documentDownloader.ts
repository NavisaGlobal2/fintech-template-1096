import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { PDFGenerator } from './pdfGenerator';

export interface DownloadOptions {
  filename?: string;
  quality?: number;
  format?: 'jpg' | 'png' | 'pdf' | 'printpdf' | 'docx';
  width?: number;
  height?: number;
}

export class DocumentDownloader {
  
  /**
   * Downloads the given HTML element as a high-quality JPG image
   */
  static async downloadAsJPG(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      toast.info('Generating JPG image...');
      
      const canvas = await this.captureElementAsCanvas(element, { 
        ...options, 
        backgroundColor: '#ffffff',
        scale: 3 // Very high quality for documents
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, options.filename || 'document.jpg');
          toast.success('JPG downloaded successfully!');
        }
      }, 'image/jpeg', options.quality || 0.98);
    } catch (error) {
      console.error('JPG generation error:', error);
      toast.error('Failed to generate JPG');
      throw error;
    }
  }

  /**
   * Downloads the given HTML element as a high-quality PNG image
   */
  static async downloadAsPNG(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      toast.info('Generating PNG image...');
      
      const canvas = await this.captureElementAsCanvas(element, { 
        ...options, 
        backgroundColor: '#ffffff',
        scale: 3 // Very high quality for documents
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, options.filename || 'document.png');
          toast.success('PNG downloaded successfully!');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('PNG generation error:', error);
      toast.error('Failed to generate PNG');
      throw error;
    }
  }

  /**
   * Downloads the given HTML element as a PDF using enhanced PDF generator
   */
  static async downloadAsPDF(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      toast.info('Generating professional PDF...');
      
      await PDFGenerator.downloadFromElement(element, {
        filename: options.filename || 'document.pdf',
        format: 'a4',
        orientation: 'portrait',
        quality: 3
      });
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
      throw error;
    }
  }

  /**
   * Opens browser print dialog for PDF generation
   */
  static async downloadAsPrintPDF(element: HTMLElement, options: DownloadOptions = {}): Promise<void> {
    try {
      toast.info('Opening print dialog...');
      
      // Create a new window with the element content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please allow popups.');
      }

      // Get the element's HTML and styles
      const elementHtml = element.outerHTML;
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      // Create print-optimized HTML
      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${options.filename || 'Document'}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${styles}
            
            @page {
              size: A4;
              margin: 20mm;
            }
            
            @media print {
              body {
                font-family: 'Times New Roman', serif !important;
                font-size: 12pt !important;
                line-height: 1.6 !important;
                color: #000 !important;
                background: #fff !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
              }
              
              .print-break {
                page-break-before: always !important;
              }
              
              .print-avoid-break {
                page-break-inside: avoid !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              table {
                page-break-inside: avoid;
                width: 100% !important;
              }
              
              h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                color: #000 !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            
            @media screen {
              body {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20mm;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                font-family: 'Times New Roman', serif;
              }
            }
          </style>
        </head>
        <body>
          ${elementHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
              
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printHtml);
      printWindow.document.close();
      
      toast.success('Print dialog opened. Choose "Save as PDF" to download.');
    } catch (error) {
      console.error('Print PDF error:', error);
      toast.error('Failed to open print dialog');
      throw error;
    }
  }

  /**
   * Generates and downloads a simplified DOCX file based on provided contract data
   */
  static async downloadAsDOCX(contractData: any, options: DownloadOptions = {}): Promise<void> {
    try {
      toast.info('Generating Word document...');

      // Create a simple HTML-based approach for better browser compatibility
      const docContent = this.generateDocxContent(contractData);
      
      // Create a blob with DOCX MIME type - browsers will handle it as HTML but Word can open it
      const blob = new Blob([docContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const filename = options.filename || `Loan-Agreement-${Date.now()}.doc`;
      this.downloadBlob(blob, filename);
      
      toast.success('Word document downloaded successfully!');
    } catch (error) {
      console.error('DOCX generation error:', error);
      toast.error('Failed to generate Word document. Trying alternative format...');
      
      // Fallback to HTML format that can be opened in Word
      try {
        const htmlContent = this.generateHtmlContent(contractData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const filename = options.filename?.replace('.docx', '.html') || `Loan-Agreement-${Date.now()}.html`;
        this.downloadBlob(blob, filename);
        toast.success('Document downloaded as HTML (can be opened in Word)');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Failed to generate document');
        throw fallbackError;
      }
    }
  }

  private static generateDocxContent(contractData: any): string {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Education Loan Agreement</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>90</w:Zoom>
        <w:DoNotPromptForConvert/>
        <w:DoNotShowInsertionsAndDeletions/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
          h1 { text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 20pt; }
          h2 { font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; }
          .contract-info { margin-bottom: 20pt; }
          .signature-section { margin-top: 40pt; page-break-before: always; }
          .signature-line { border-bottom: 1px solid black; width: 200pt; display: inline-block; margin: 10pt 0; }
          table { width: 100%; border-collapse: collapse; margin: 10pt 0; }
          th, td { border: 1px solid black; padding: 8pt; text-align: left; }
          th { background-color: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>EDUCATION LOAN AGREEMENT</h1>
        
        <div class="contract-info">
          <p><strong>Contract Reference:</strong> ${contractData.contractId || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <h2>BORROWER INFORMATION</h2>
        <p><strong>Name:</strong> ${contractData.borrower?.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> ${contractData.borrower?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${contractData.borrower?.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${contractData.borrower?.address || 'N/A'}</p>

        <h2>LOAN DETAILS</h2>
        <table>
          <tr><th>Loan Amount</th><td>$${contractData.loanAmount?.toLocaleString() || 'N/A'}</td></tr>
          <tr><th>Interest Rate</th><td>${contractData.interestRate || 'N/A'}%</td></tr>
          <tr><th>Term</th><td>${contractData.termMonths || 'N/A'} months</td></tr>
          <tr><th>Monthly Payment</th><td>$${contractData.monthlyPayment?.toLocaleString() || 'N/A'}</td></tr>
        </table>

        <div class="signature-section">
          <h2>EXECUTION OF AGREEMENT</h2>
          
          <p><strong>BORROWER SIGNATURE</strong></p>
          <p>Signature: <span class="signature-line"></span></p>
          <p>Date: <span class="signature-line"></span></p>
          
          <br><br>
          
          <p><strong>LENDER SIGNATURE</strong></p>
          <p>Authorized Representative: <span class="signature-line"></span></p>
          <p>Date: <span class="signature-line"></span></p>
        </div>
      </body>
      </html>
    `;
  }

  private static generateHtmlContent(contractData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Education Loan Agreement</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.6; 
            max-width: 8.5in; 
            margin: 0 auto; 
            padding: 1in; 
          }
          h1 { text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 20pt; }
          h2 { font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; }
          .contract-info { margin-bottom: 20pt; }
          .signature-section { margin-top: 40pt; }
          .signature-line { border-bottom: 1px solid black; width: 3in; display: inline-block; margin: 10pt 0; }
          table { width: 100%; border-collapse: collapse; margin: 10pt 0; }
          th, td { border: 1px solid black; padding: 8pt; text-align: left; }
          th { background-color: #f0f0f0; font-weight: bold; }
          @media print {
            body { margin: 0; padding: 1in; }
            .signature-section { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <h1>EDUCATION LOAN AGREEMENT</h1>
        
        <div class="contract-info">
          <p><strong>Contract Reference:</strong> ${contractData.contractId || 'N/A'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <h2>BORROWER INFORMATION</h2>
        <p><strong>Name:</strong> ${contractData.borrower?.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> ${contractData.borrower?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${contractData.borrower?.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${contractData.borrower?.address || 'N/A'}</p>

        <h2>LOAN DETAILS</h2>
        <table>
          <tr><th>Loan Amount</th><td>$${contractData.loanAmount?.toLocaleString() || 'N/A'}</td></tr>
          <tr><th>Interest Rate</th><td>${contractData.interestRate || 'N/A'}%</td></tr>
          <tr><th>Term</th><td>${contractData.termMonths || 'N/A'} months</td></tr>
          <tr><th>Monthly Payment</th><td>$${contractData.monthlyPayment?.toLocaleString() || 'N/A'}</td></tr>
        </table>

        <div class="signature-section">
          <h2>EXECUTION OF AGREEMENT</h2>
          
          <p><strong>BORROWER SIGNATURE</strong></p>
          <p>Signature: <span class="signature-line"></span></p>
          <p>Date: <span class="signature-line"></span></p>
          
          <br><br>
          
          <p><strong>LENDER SIGNATURE</strong></p>
          <p>Authorized Representative: <span class="signature-line"></span></p>
          <p>Date: <span class="signature-line"></span></p>
        </div>

        <script>
          // Instructions for the user
          document.addEventListener('DOMContentLoaded', function() {
            const instruction = document.createElement('div');
            instruction.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #007bff; color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 1000;';
            instruction.innerHTML = 'This document can be opened and edited in Microsoft Word or LibreOffice';
            document.body.appendChild(instruction);
            
            setTimeout(() => {
              if (instruction.parentNode) {
                instruction.parentNode.removeChild(instruction);
              }
            }, 5000);
          });
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Capture HTML element as high-quality canvas
   */
  private static async captureElementAsCanvas(element: HTMLElement, options: any = {}): Promise<HTMLCanvasElement> {
    // Ensure element is visible and properly rendered
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    const originalPosition = element.style.position;
    
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.position = 'relative';
    
    // Wait for fonts and layout to settle
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: options.backgroundColor || '#ffffff',
        scale: options.scale || 3,
        useCORS: true,
        allowTaint: false,
        logging: false,
        height: options.height || element.scrollHeight,
        width: options.width || element.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        windowHeight: 800,
        imageTimeout: 15000,
        foreignObjectRendering: true,
        // Handle web fonts properly
        onclone: async (clonedDoc) => {
          // Load fonts in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            * { 
              font-family: 'Inter', 'Times New Roman', serif !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // Wait for fonts to load
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      });
      
      return canvas;
    } finally {
      // Restore original styles
      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
      element.style.position = originalPosition;
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
   * Returns available download formats with their metadata
   */
  static getAvailableFormats() {
    return [
      {
        value: 'png',
        label: 'PNG Image',
        description: 'High-quality image format (recommended)',
        icon: '🖼️'
      },
      {
        value: 'jpg',
        label: 'JPG Image', 
        description: 'Compressed image format',
        icon: '📷'
      },
      {
        value: 'printpdf',
        label: 'Print to PDF',
        description: 'Professional PDF via browser print',
        icon: '🖨️'
      },
      {
        value: 'pdf',
        label: 'Enhanced PDF',
        description: 'Generated PDF with pagination',
        icon: '📄'
      },
      {
        value: 'docx',
        label: 'Word Document',
        description: 'Editable document format',
        icon: '📝'
      }
    ];
  }
}