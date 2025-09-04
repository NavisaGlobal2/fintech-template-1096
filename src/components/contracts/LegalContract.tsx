import React, { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  FileText,
  Gavel,
  Shield,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react';

interface LegalContractProps {
  contract: {
    id: string;
    contractType: 'loan' | 'isa' | 'hybrid';
    loanAmount: number;
    aprRate?: number;
    isaPercentage?: number;
    repaymentTermMonths: number;
    gracePeriodMonths: number;
    repaymentSchedule: any;
    termsAndConditions: any;
    offerValidUntil: string;
    createdAt: string;
  };
  borrower: {
    fullName: string;
    email: string;
    address: string;
    dateOfBirth?: string;
    nationalId?: string;
  };
  lender: {
    companyName: string;
    registeredAddress: string;
    registrationNumber: string;
    contactEmail: string;
    phoneNumber: string;
  };
  signatureData?: {
    borrowerSignature?: string;
    signedDate?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  className?: string;
}

export const LegalContract = forwardRef<HTMLDivElement, LegalContractProps>(({
  contract,
  borrower,
  lender,
  signatureData,
  className = ""
}, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getContractTitle = (type: string) => {
    switch (type) {
      case 'loan': return 'LOAN AGREEMENT';
      case 'isa': return 'INCOME SHARE AGREEMENT';
      case 'hybrid': return 'HYBRID FINANCING AGREEMENT';
      default: return 'FINANCING AGREEMENT';
    }
  };

  const contractNumber = `TSF-${contract.id.slice(0, 8).toUpperCase()}`;
  const executionDate = new Date().toLocaleDateString('en-GB');

  return (
    <div 
      ref={ref}
      className={`bg-white text-black font-serif leading-relaxed ${className}`}
      id="legal-contract-document"
    >
      {/* Contract Header */}
      <div className="text-center border-b-2 border-black pb-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div className="text-left">
            <Building className="h-8 w-8 text-gray-600 mb-2" />
            <p className="text-sm font-sans">{lender.companyName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-sans">Contract No: {contractNumber}</p>
            <p className="text-sm font-sans">Date: {executionDate}</p>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-wide mb-2">
          {getContractTitle(contract.contractType)}
        </h1>
        <p className="text-lg text-gray-700">
          Principal Amount: {formatCurrency(contract.loanAmount)}
        </p>
      </div>

      {/* Parties Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          1. PARTIES TO THIS AGREEMENT
        </h2>
        
        <div className="ml-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1.1 Lender:</h3>
            <div className="ml-6 space-y-1">
              <p><strong>{lender.companyName}</strong></p>
              <p>Registered Address: {lender.registeredAddress}</p>
              <p>Company Registration Number: {lender.registrationNumber}</p>
              <p>Email: {lender.contactEmail}</p>
              <p>Phone: {lender.phoneNumber}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">1.2 Borrower:</h3>
            <div className="ml-6 space-y-1">
              <p><strong>{borrower.fullName}</strong></p>
              <p>Address: {borrower.address}</p>
              <p>Email: {borrower.email}</p>
              {borrower.dateOfBirth && <p>Date of Birth: {formatDate(borrower.dateOfBirth)}</p>}
              {borrower.nationalId && <p>National ID: {borrower.nationalId}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Recitals */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          2. RECITALS
        </h2>
        
        <div className="ml-4 space-y-3">
          <p><strong>WHEREAS,</strong> the Borrower has applied for financial assistance to support educational or career development purposes;</p>
          <p><strong>WHEREAS,</strong> the Lender has agreed to provide financing subject to the terms and conditions set forth herein;</p>
          <p><strong>WHEREAS,</strong> both parties desire to enter into this Agreement to formalize their respective rights and obligations;</p>
          <p><strong>NOW, THEREFORE,</strong> in consideration of the mutual covenants contained herein, the parties agree as follows:</p>
        </div>
      </div>

      {/* Loan Terms */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          3. LOAN TERMS AND CONDITIONS
        </h2>
        
        <div className="ml-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">3.1 Principal Amount:</h3>
            <p className="ml-6">The Lender agrees to advance to the Borrower the sum of <strong>{formatCurrency(contract.loanAmount)}</strong> (the "Principal Amount").</p>
          </div>

          {contract.aprRate && (
            <div>
              <h3 className="font-semibold mb-2">3.2 Interest Rate:</h3>
              <p className="ml-6">The loan shall bear interest at an annual percentage rate (APR) of <strong>{contract.aprRate}%</strong>.</p>
            </div>
          )}

          {contract.isaPercentage && (
            <div>
              <h3 className="font-semibold mb-2">3.3 Income Share Percentage:</h3>
              <p className="ml-6">The Borrower agrees to pay <strong>{contract.isaPercentage}%</strong> of their gross monthly income as defined in this Agreement.</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">3.4 Repayment Term:</h3>
            <p className="ml-6">The repayment term shall be <strong>{contract.repaymentTermMonths} months</strong> from the first payment date.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3.5 Grace Period:</h3>
            <p className="ml-6">A grace period of <strong>{contract.gracePeriodMonths} months</strong> is granted before the first payment becomes due.</p>
          </div>
        </div>
      </div>

      {/* Repayment Schedule */}
      {contract.repaymentSchedule && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
            4. REPAYMENT SCHEDULE
          </h2>
          
          <div className="ml-4 space-y-4">
            {contract.repaymentSchedule.monthlyPayment && (
              <div>
                <h3 className="font-semibold mb-2">4.1 Monthly Payment:</h3>
                <p className="ml-6">The Borrower shall pay <strong>{formatCurrency(contract.repaymentSchedule.monthlyPayment)}</strong> per month.</p>
              </div>
            )}

            {contract.repaymentSchedule.firstPaymentDate && (
              <div>
                <h3 className="font-semibold mb-2">4.2 First Payment Date:</h3>
                <p className="ml-6">The first payment is due on <strong>{formatDate(contract.repaymentSchedule.firstPaymentDate)}</strong>.</p>
              </div>
            )}

            {contract.repaymentSchedule.totalRepayment && (
              <div>
                <h3 className="font-semibold mb-2">4.3 Total Repayment:</h3>
                <p className="ml-6">The total amount to be repaid is <strong>{formatCurrency(contract.repaymentSchedule.totalRepayment)}</strong>.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Borrower Representations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          5. BORROWER REPRESENTATIONS AND WARRANTIES
        </h2>
        
        <div className="ml-4 space-y-2">
          <p>5.1 The Borrower represents and warrants that:</p>
          <ul className="ml-8 list-disc space-y-1">
            <li>They have the legal capacity to enter into this Agreement;</li>
            <li>All information provided in the loan application is true and accurate;</li>
            <li>They are not in default under any other loan or credit agreement;</li>
            <li>They will use the loan proceeds only for the stated educational or career purposes;</li>
            <li>They will promptly notify the Lender of any material change in financial circumstances.</li>
          </ul>
        </div>
      </div>

      {/* Events of Default */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          6. EVENTS OF DEFAULT
        </h2>
        
        <div className="ml-4 space-y-2">
          <p>6.1 The following shall constitute events of default:</p>
          <ul className="ml-8 list-disc space-y-1">
            <li>Failure to make any payment when due and such failure continues for thirty (30) days;</li>
            <li>Breach of any representation, warranty, or covenant contained herein;</li>
            <li>Filing for bankruptcy or insolvency proceedings;</li>
            <li>Material adverse change in the Borrower's financial condition;</li>
            <li>Providing false or misleading information to the Lender.</li>
          </ul>
        </div>
      </div>

      {/* Remedies */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          7. REMEDIES
        </h2>
        
        <div className="ml-4 space-y-2">
          <p>7.1 Upon the occurrence of an Event of Default, the Lender may:</p>
          <ul className="ml-8 list-disc space-y-1">
            <li>Declare the entire unpaid balance immediately due and payable;</li>
            <li>Pursue collection through legal proceedings;</li>
            <li>Report delinquency to credit reporting agencies;</li>
            <li>Exercise any other rights available at law or in equity.</li>
          </ul>
        </div>
      </div>

      {/* Miscellaneous Provisions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
          8. MISCELLANEOUS PROVISIONS
        </h2>
        
        <div className="ml-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">8.1 Governing Law:</h3>
            <p className="ml-6">This Agreement shall be governed by the laws of England and Wales.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">8.2 Amendment:</h3>
            <p className="ml-6">This Agreement may only be amended in writing signed by both parties.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">8.3 Severability:</h3>
            <p className="ml-6">If any provision is deemed invalid, the remainder of this Agreement shall remain in full force and effect.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">8.4 Electronic Signature:</h3>
            <p className="ml-6">Electronic signatures shall have the same legal effect as handwritten signatures.</p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-12 pt-8 border-t-2 border-black">
        <h2 className="text-xl font-bold mb-6 text-center">
          SIGNATURE PAGE
        </h2>

        <p className="text-center mb-8 text-gray-700">
          By signing below, the parties acknowledge they have read, understood, and agree to be bound by all terms of this Agreement.
        </p>

        <div className="grid grid-cols-2 gap-12 mt-8">
          {/* Lender Signature */}
          <div>
            <h3 className="font-semibold mb-4 text-center">LENDER</h3>
            <div className="text-center space-y-4">
              <div className="h-16 border-b border-black flex items-end justify-center pb-2">
                <span className="text-sm text-gray-600">Digital Signature on File</span>
              </div>
              <div>
                <p className="font-medium">{lender.companyName}</p>
                <p className="text-sm">By: Authorized Representative</p>
                <p className="text-sm">Date: {executionDate}</p>
              </div>
            </div>
          </div>

          {/* Borrower Signature */}
          <div>
            <h3 className="font-semibold mb-4 text-center">BORROWER</h3>
            <div className="text-center space-y-4">
              {signatureData?.borrowerSignature ? (
                <div className="h-16 border border-gray-300 flex items-center justify-center">
                  <img 
                    src={`data:image/png;base64,${signatureData.borrowerSignature}`} 
                    alt="Borrower Signature" 
                    className="max-h-full"
                  />
                </div>
              ) : (
                <div className="h-16 border-b border-black flex items-end justify-center pb-2">
                  <span className="text-sm text-gray-400">Signature Required</span>
                </div>
              )}
              <div>
                <p className="font-medium">{borrower.fullName}</p>
                <p className="text-sm">Borrower</p>
                {signatureData?.signedDate && (
                  <p className="text-sm">Date: {formatDate(signatureData.signedDate)}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Electronic Signature Notice */}
        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded">
          <p className="text-xs text-center text-gray-700">
            <strong>ELECTRONIC SIGNATURE DISCLOSURE:</strong> This document has been electronically signed in accordance with 
            applicable electronic signature laws. The parties acknowledge that electronic signatures are legally binding and 
            have the same force and effect as handwritten signatures.
          </p>
          {signatureData?.ipAddress && (
            <p className="text-xs text-center text-gray-600 mt-2">
              Signed from IP: {signatureData.ipAddress} | 
              User Agent: {signatureData.userAgent?.substring(0, 50)}...
            </p>
          )}
        </div>
      </div>

      {/* Document Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
        <p>Contract ID: {contract.id}</p>
        <p>Generated: {formatDate(contract.createdAt)}</p>
        <p className="mt-2">{lender.companyName} - Confidential and Proprietary</p>
      </div>
    </div>
  );
});

LegalContract.displayName = 'LegalContract';