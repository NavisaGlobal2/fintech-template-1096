import React, { forwardRef } from 'react';
import { 
  EDUCATION_LOAN_TEMPLATE, 
  getContractTemplate, 
  generateContractSections,
  populateTemplateVariables,
  type ContractTemplate 
} from './ContractTemplates';

interface LegalContractProps {
  contract: {
    id: string;
    contractType: string;
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
  className?: string;
}

export const LegalContract = forwardRef<HTMLDivElement, LegalContractProps>(({
  contract,
  borrower,
  lender,
  className = ""
}, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  // Calculate derived values from contract
  const loanAmount = contract.loanAmount;
  const processingFeePercent = 1.5;
  const processingFee = Math.round(loanAmount * (processingFeePercent / 100));
  const netDisbursement = loanAmount - processingFee;
  const monthlyRate = (contract.aprRate || 3.9) / 12;
  const totalInterest = contract.repaymentSchedule?.totalInterest || Math.round(loanAmount * monthlyRate * contract.repaymentTermMonths / 100);
  const totalRepayable = loanAmount + totalInterest;
  const totalCostOfCredit = processingFee + totalInterest;
  const monthlyPayment = Math.round(totalRepayable / contract.repaymentTermMonths);

  // Generate proper repayment schedule table
  const generateRepaymentScheduleTable = () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + (contract.gracePeriodMonths || 0) + 1);
    
    let remainingBalance = loanAmount;
    const schedule = [];
    
    for (let i = 1; i <= contract.repaymentTermMonths; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i - 1);
      
      const interestPayment = Math.round(remainingBalance * (monthlyRate / 100));
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
      
      schedule.push({
        installment: i,
        date: paymentDate.toLocaleDateString('en-GB'),
        principal: principalPayment,
        interest: interestPayment,
        total: monthlyPayment,
        balance: remainingBalance
      });
    }
    
    return schedule;
  };

  const repaymentSchedule = generateRepaymentScheduleTable();

  // JSX Repayment Schedule Table Component
  const RepaymentScheduleTable = () => (
    <div className="repayment-schedule mt-6">
      <table className="w-full border-collapse border border-gray-400 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-400 px-3 py-2 text-left">Installment</th>
            <th className="border border-gray-400 px-3 py-2 text-left">Payment Date</th>
            <th className="border border-gray-400 px-3 py-2 text-right">Principal (£)</th>
            <th className="border border-gray-400 px-3 py-2 text-right">Interest (£)</th>
            <th className="border border-gray-400 px-3 py-2 text-right">Total Payment (£)</th>
            <th className="border border-gray-400 px-3 py-2 text-right">Outstanding Balance (£)</th>
          </tr>
        </thead>
        <tbody>
          {repaymentSchedule.map((payment) => (
            <tr key={payment.installment}>
              <td className="border border-gray-400 px-3 py-2">{payment.installment}</td>
              <td className="border border-gray-400 px-3 py-2">{payment.date}</td>
              <td className="border border-gray-400 px-3 py-2 text-right">{payment.principal.toLocaleString()}</td>
              <td className="border border-gray-400 px-3 py-2 text-right">{payment.interest.toLocaleString()}</td>
              <td className="border border-gray-400 px-3 py-2 text-right font-semibold">{payment.total.toLocaleString()}</td>
              <td className="border border-gray-400 px-3 py-2 text-right">{payment.balance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr className="font-semibold">
            <td className="border border-gray-400 px-3 py-2" colSpan={2}>TOTALS</td>
            <td className="border border-gray-400 px-3 py-2 text-right">£{loanAmount.toLocaleString()}</td>
            <td className="border border-gray-400 px-3 py-2 text-right">£{totalInterest.toLocaleString()}</td>
            <td className="border border-gray-400 px-3 py-2 text-right">£{totalRepayable.toLocaleString()}</td>
            <td className="border border-gray-400 px-3 py-2 text-right">£0</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // Create repayment schedule table HTML (for template variable replacement)
  const createRepaymentScheduleTable = () => {
    return '<div>Repayment schedule table will be inserted here as JSX component</div>';
  };

  const contractData = {
    loanAmount: formatCurrency(loanAmount).replace('£', ''),
    loanAmountWords: 'Twenty Six Thousand Pounds Sterling', // TODO: Convert numbers to words
    processingFeePercent: processingFeePercent.toString(),
    processingFee: processingFee.toString(),
    netDisbursement: netDisbursement.toString(),
    interestRate: (contract.aprRate || 3.9).toString(),
    loanTerm: contract.repaymentTermMonths.toString(),
    loanTermWords: 'Sixty', // TODO: Convert numbers to words
    firstPaymentDate: formatDate(new Date(Date.now() + (contract.gracePeriodMonths || 0) * 30 * 24 * 60 * 60 * 1000)),
    numberOfInstallments: contract.repaymentTermMonths.toString(),
    installmentAmount: monthlyPayment.toString(),
    principalPerInstallment: Math.round(loanAmount / contract.repaymentTermMonths).toString(),
    interestPerInstallment: Math.round(totalInterest / contract.repaymentTermMonths).toString(),
    totalRepayable: totalRepayable.toString(),
    totalInterest: totalInterest.toString(),
    totalCostOfCredit: totalCostOfCredit.toString(),
    borrowerName: borrower.fullName || 'Loan Applicant',
    borrowerAddress: borrower.address || 'Address not provided',
    lenderName: lender.companyName,
    lenderAddress: lender.registeredAddress,
    lenderEmail: lender.contactEmail,
    lenderPhone: lender.phoneNumber,
    guarantorName: '[Guarantor\'s Full Name]',
    guarantorAddress: '[Guarantor\'s Address]',
    agreementDate: formatDate(new Date()),
    bankName: 'Tide Bank',
    sortCode: '04-06-05',
    accountNumber: '22106965',
    repaymentScheduleTable: createRepaymentScheduleTable()
  };

  const template = getContractTemplate('education_loan');
  const populatedSections = generateContractSections(template, contractData);

  return (
    <div ref={ref} id="legal-contract" className={`bg-white text-black max-w-4xl mx-auto ${className}`}>
      {/* Cover Page */}
      <div className="text-center mb-8 p-8 border-b-2 border-black">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">Confidential</p>
          <div className="w-full border-t border-black mb-8"></div>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-wide">
            EDUCATION LOAN AGREEMENT
          </h1>
          
          <div className="text-2xl font-semibold space-y-4">
            <p className="text-3xl">BETWEEN</p>
            
            <div className="space-y-6 my-8">
              <p className="text-2xl font-bold">{contractData.lenderName}</p>
              <p className="text-2xl">AND</p>
              <p className="text-xl">{contractData.borrowerName}</p>
            </div>
          </div>
        </div>
        
        <div className="w-full border-t border-black mt-8"></div>
        <p className="text-sm text-right mt-4">Page 1 of 10</p>
      </div>

      {/* Agreement Header */}
      <div className="mb-8">
        <p className="text-lg mb-4">
          This Education Loan Agreement (the "Agreement") is made on {contractData.agreementDate}.
        </p>
        
        <div className="mb-6">
          <p className="font-semibold text-lg mb-2">BETWEEN</p>
          <p className="mb-2">
            {contractData.lenderName}, a company incorporated in England and Wales with its registered office at {contractData.lenderAddress} (the "Lender", which expression shall include its successors and 
            assigns);
          </p>
          <p className="mb-2">AND</p>
          <p className="mb-2">
            Mr. {contractData.borrowerName}, of {contractData.borrowerAddress}, United 
            Kingdom (the "Borrower");
          </p>
          <p className="mb-2">AND</p>
          <p className="mb-4">
            {contractData.guarantorName}, of {contractData.guarantorAddress} (the "Guarantor").
          </p>
          <p>The Borrower, Guarantor, and Lender are collectively referred to as the "Parties".</p>
        </div>
      </div>

      {/* Recitals */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">RECITALS</h2>
        {template.recitals.map((recital, index) => (
          <p key={index} className="mb-3">
            <span className="font-semibold">{recital.letter}.</span> {populateTemplateVariables(recital.content, contractData)}
          </p>
        ))}
      </div>

      {/* Contract Sections */}
      {populatedSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            {section.number}. {section.title}
          </h2>
          
          {section.subsections.map((subsection, subsectionIndex) => (
            <div key={subsectionIndex} className="mb-4">
              <h3 className="font-semibold mb-2">
                {subsection.number} {subsection.title}
              </h3>
              
              <div>
                {/* Special handling for Repayment Schedule section */}
                {section.number === "9" && subsection.title === "Installment Schedule" ? (
                  <div>
                    <p className="mb-2">The repayment schedule for this loan agreement is as follows:</p>
                    <RepaymentScheduleTable />
                  </div>
                ) : (
                  <>
                    <p className="mb-2">{subsection.content}</p>
                    {subsection.isList && subsection.listItems && (
                      <ul className="list-none ml-4 space-y-1">
                        {subsection.listItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="mb-1">• {item}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Signature Blocks */}
      <div className="mt-12 space-y-8">
        {template.signatureBlocks.map((block, index) => (
          <div key={index} className="border-t pt-6">
            <h3 className="font-semibold mb-4">{block.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {block.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="mb-4">
                  <div className="border-b border-gray-400 pb-1 mb-2 h-8"></div>
                  <p className="text-sm text-gray-600">{field}: _____________________</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t text-center text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p>Document generated electronically on {formatDate(new Date())}</p>
            <p>TechSkillUK Ltd - Empowering Your Future</p>
          </div>
          <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center">
            <span className="text-black font-bold text-2xl">S</span>
          </div>
        </div>
      </div>
    </div>
  );
});