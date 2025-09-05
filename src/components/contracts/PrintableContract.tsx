import React, { forwardRef } from 'react';
import { LegalContract } from './LegalContract';

interface PrintableContractProps {
  contract: any;
  borrower: any;
  lender: any;
  signatureData?: {
    signature: string;
    timestamp: string;
    ipAddress: string;
  } | null;
}

export const PrintableContract = forwardRef<HTMLDivElement, PrintableContractProps>(
  ({ contract, borrower, lender, signatureData }, ref) => {
    return (
      <div ref={ref} className="printable-contract">
        <style>{`
          @media print {
            .printable-contract {
              font-family: 'Times New Roman', serif !important;
              font-size: 12pt !important;
              line-height: 1.6 !important;
              color: #000 !important;
              background: #fff !important;
              margin: 0 !important;
              padding: 20mm !important;
              box-shadow: none !important;
            }
            
            .print-page {
              page-break-before: always;
              min-height: 250mm;
              padding: 20mm;
              background: white;
              position: relative;
            }
            
            .print-page:first-child {
              page-break-before: auto;
            }
            
            .contract-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }
            
            .contract-title {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000;
            }
            
            .contract-reference {
              font-size: 12pt;
              color: #666;
            }
            
            .contract-section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 15px;
              color: #000;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            
            .contract-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 11pt;
            }
            
            .contract-table th,
            .contract-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            
            .contract-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            
            .signature-section {
              margin-top: 40px;
              page-break-before: always;
              min-height: 200px;
            }
            
            .signature-block {
              margin: 30px 0;
              padding: 20px;
              border: 1px solid #000;
              background: #f9f9f9;
            }
            
            .signature-line {
              border-bottom: 1px solid #000;
              height: 50px;
              margin: 10px 0;
              position: relative;
            }
            
            .signature-image {
              max-width: 200px;
              max-height: 60px;
              margin: 10px 0;
            }
            
            .page-footer {
              position: absolute;
              bottom: 15mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              font-size: 10pt;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            
            .print-only {
              display: block !important;
            }
            
            .no-print {
              display: none !important;
            }
          }
          
          @media screen {
            .printable-contract {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20mm;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
            }
            
            .print-page {
              min-height: 250mm;
              margin-bottom: 30px;
              padding: 20mm;
              background: white;
              border: 1px solid #ddd;
              position: relative;
            }
            
            .print-only {
              display: none;
            }
          }
        `}</style>

        <div className="print-page">
          {/* Contract Header */}
          <div className="contract-header">
            <h1 className="contract-title">EDUCATION LOAN AGREEMENT</h1>
            <div className="contract-reference">
              Contract Reference: {contract.contractId || contract.id}
            </div>
            <div className="contract-reference">
              Date: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Render the main contract content */}
          <LegalContract
            contract={contract}
            borrower={borrower}
            lender={lender}
          />
        </div>

        {/* Signature Page */}
        {signatureData && (
          <div className="print-page signature-section">
            <h2 className="section-title">EXECUTION OF AGREEMENT</h2>
            
            <div className="signature-block">
              <h3>BORROWER SIGNATURE</h3>
              <p><strong>Name:</strong> {borrower.fullName}</p>
              <p><strong>Date:</strong> {new Date(signatureData.timestamp).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(signatureData.timestamp).toLocaleTimeString()}</p>
              
              <div className="signature-line">
                {signatureData.signature && (
                  <img 
                    src={signatureData.signature} 
                    alt="Digital Signature" 
                    className="signature-image"
                  />
                )}
              </div>
              
              <p><strong>Digital Signature Verification:</strong></p>
              <p>IP Address: {signatureData.ipAddress}</p>
              <p>Timestamp: {signatureData.timestamp}</p>
            </div>

            <div className="signature-block">
              <h3>LENDER SIGNATURE</h3>
              <p><strong>Company:</strong> {lender.companyName}</p>
              <p><strong>Authorized Representative:</strong> _________________________</p>
              <p><strong>Date:</strong> _________________________</p>
              
              <div className="signature-line"></div>
            </div>

            <div className="page-footer">
              <p>This document was electronically signed and is legally binding.</p>
              <p>Contract ID: {contract.contractId || contract.id} | Page 2 of 2</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PrintableContract.displayName = 'PrintableContract';