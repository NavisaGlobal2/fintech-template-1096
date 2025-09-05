import React, { forwardRef } from 'react';
import { 
  EDUCATION_LOAN_TEMPLATE, 
  getContractTemplate, 
  generateContractSections,
  populateTemplateVariables,
  type ContractTemplate 
} from './ContractTemplates';
import { numberToWordsCapitalized, currencyToWords } from '../../utils/numberToWords';

interface GuarantorDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  relationship: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  dateOfBirth: string;
  nationalId: string;
}

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
  guarantor?: GuarantorDetails | null;
  className?: string;
}

export const LegalContract = forwardRef<HTMLDivElement, LegalContractProps>(({
  contract,
  borrower,
  lender,
  guarantor,
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

  // Enhanced Repayment Schedule Table Component
  const RepaymentScheduleTable = () => (
    <div className="repayment-schedule mt-6 no-page-break">
      <h4 className="font-bold text-sm mb-3 text-center">LOAN REPAYMENT SCHEDULE</h4>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-2 py-3 text-center font-bold">Installment No.</th>
            <th className="border border-black px-2 py-3 text-center font-bold">Payment Date</th>
            <th className="border border-black px-2 py-3 text-center font-bold">Principal (£)</th>
            <th className="border border-black px-2 py-3 text-center font-bold">Interest (£)</th>
            <th className="border border-black px-2 py-3 text-center font-bold">Total Payment (£)</th>
            <th className="border border-black px-2 py-3 text-center font-bold">Outstanding Balance (£)</th>
          </tr>
        </thead>
        <tbody>
          {repaymentSchedule.map((payment, index) => (
            <tr key={payment.installment} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-black px-2 py-2 text-center">{payment.installment}</td>
              <td className="border border-black px-2 py-2 text-center">{payment.date}</td>
              <td className="border border-black px-2 py-2 text-right currency">£{payment.principal.toLocaleString('en-GB')}</td>
              <td className="border border-black px-2 py-2 text-right currency">£{payment.interest.toLocaleString('en-GB')}</td>
              <td className="border border-black px-2 py-2 text-right font-semibold currency">£{payment.total.toLocaleString('en-GB')}</td>
              <td className="border border-black px-2 py-2 text-right currency">£{payment.balance.toLocaleString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-bold">
            <td className="border-2 border-black px-2 py-3 text-center font-bold" colSpan={2}>TOTAL AMOUNTS</td>
            <td className="border-2 border-black px-2 py-3 text-right font-bold currency">£{loanAmount.toLocaleString('en-GB')}</td>
            <td className="border-2 border-black px-2 py-3 text-right font-bold currency">£{totalInterest.toLocaleString('en-GB')}</td>
            <td className="border-2 border-black px-2 py-3 text-right font-bold currency">£{totalRepayable.toLocaleString('en-GB')}</td>
            <td className="border-2 border-black px-2 py-3 text-right font-bold currency">£0</td>
          </tr>
        </tfoot>
      </table>
      <p className="text-xs text-gray-600 mt-2 text-center italic">
        * All payments are due on the specified dates. Late payment charges may apply as per the terms and conditions.
      </p>
    </div>
  );

  // Create repayment schedule table HTML (for template variable replacement)
  const createRepaymentScheduleTable = () => {
    return '<div>Repayment schedule table will be inserted here as JSX component</div>';
  };

  // Format addresses properly
  const formatAddress = (address: string | { street: string; city: string; state: string; postalCode: string; country: string }) => {
    if (typeof address === 'string') {
      return address.replace(/,/g, ',\n').trim();
    }
    return `${address.street}\n${address.city}${address.state ? ', ' + address.state : ''}\n${address.postalCode}\n${address.country}`;
  };

  const contractData = {
    loanAmount: loanAmount.toLocaleString('en-GB'),
    loanAmountWords: currencyToWords(loanAmount),
    processingFeePercent: processingFeePercent.toString(),
    processingFee: processingFee.toLocaleString('en-GB'),
    netDisbursement: netDisbursement.toLocaleString('en-GB'),
    interestRate: (contract.aprRate || 3.9).toString(),
    loanTerm: contract.repaymentTermMonths.toString(),
    loanTermWords: numberToWordsCapitalized(contract.repaymentTermMonths),
    firstPaymentDate: formatDate(new Date(Date.now() + (contract.gracePeriodMonths || 0) * 30 * 24 * 60 * 60 * 1000)),
    numberOfInstallments: contract.repaymentTermMonths.toString(),
    installmentAmount: monthlyPayment.toLocaleString('en-GB'),
    principalPerInstallment: Math.round(loanAmount / contract.repaymentTermMonths).toLocaleString('en-GB'),
    interestPerInstallment: Math.round(totalInterest / contract.repaymentTermMonths).toLocaleString('en-GB'),
    totalRepayable: totalRepayable.toLocaleString('en-GB'),
    totalInterest: totalInterest.toLocaleString('en-GB'),
    totalCostOfCredit: totalCostOfCredit.toLocaleString('en-GB'),
    borrowerName: borrower.fullName || 'Loan Applicant',
    borrowerAddress: formatAddress(borrower.address || 'Address not provided'),
    lenderName: lender.companyName,
    lenderAddress: formatAddress(lender.registeredAddress),
    lenderEmail: lender.contactEmail,
    lenderPhone: lender.phoneNumber,
    guarantorName: guarantor?.name || '[Guarantor\'s Full Name]',
    guarantorAddress: guarantor ? formatAddress(guarantor.address) : '[Guarantor\'s Address]',
    guarantorPhone: guarantor?.phone || '[Guarantor\'s Phone]',
    guarantorEmail: guarantor?.email || '[Guarantor\'s Email]',
    guarantorRelationship: guarantor?.relationship || '[Relationship to Borrower]',
    agreementDate: formatDate(new Date()),
    bankName: 'Tide Bank',
    sortCode: '04-06-05',
    accountNumber: '22106965',
    repaymentScheduleTable: createRepaymentScheduleTable(),
    contractRef: `EDU-${contract.id.slice(0, 8).toUpperCase()}-${new Date().getFullYear()}`
  };

  const template = getContractTemplate('education_loan');
  const populatedSections = generateContractSections(template, contractData);

  return (
    <div ref={ref} id="legal-contract" className={`bg-white text-black w-full ${className}`} style={{ fontFamily: '"Times New Roman", serif', fontSize: '11pt', lineHeight: '1.4' }}>
      {/* Contract Reference Number */}
      <div className="contract-ref text-xs text-gray-600 mb-2 text-right">
        Contract Ref: {contractData.contractRef}
      </div>

      {/* Cover Page */}
      <div className="cover-page text-center p-12 page-break-after">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-6 uppercase tracking-wider">CONFIDENTIAL LEGAL DOCUMENT</p>
          <div className="w-full border-t-2 border-black mb-12"></div>
        </div>
        
        <div className="space-y-12">
          <h1 className="text-5xl font-bold tracking-widest uppercase">
            EDUCATION LOAN AGREEMENT
          </h1>
          
          <div className="text-xl space-y-8 my-16">
            <p className="text-3xl font-semibold tracking-wide">BETWEEN</p>
            
            <div className="space-y-8 my-12">
              <div className="p-6 border-2 border-gray-400">
                <p className="text-2xl font-bold mb-2">{contractData.lenderName}</p>
                <p className="text-base text-gray-700">(The Lender)</p>
              </div>
              
              <p className="text-3xl font-semibold">AND</p>
              
              <div className="p-6 border-2 border-gray-400">
                <p className="text-xl font-semibold">{contractData.borrowerName}</p>
                <p className="text-base text-gray-700">(The Borrower)</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p className="mb-1">Loan Amount: £{contractData.loanAmount}</p>
                <p>Term: {contractData.loanTerm} months</p>
              </div>
              <div className="text-right">
                <p className="mb-1">Agreement Date: {contractData.agreementDate}</p>
                <p>Document Version: 1.0</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="w-full border-t-2 border-black mb-4"></div>
          <p className="text-sm text-gray-600">TechSkillUK Ltd - Professional Education Funding</p>
        </div>
      </div>

      {/* Agreement Header */}
      <div className="contract-parties mb-8 page-break-after">
        <h2 className="text-xl font-bold mb-6 text-center uppercase">PARTIES TO THE AGREEMENT</h2>
        
        <p className="text-base mb-6 text-justify">
          This Education Loan Agreement (the "Agreement") is made on <strong>{contractData.agreementDate}</strong> by and between the parties identified below, who agree to be bound by the terms and conditions set forth herein.
        </p>
        
        <div className="space-y-6">
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-bold text-lg mb-2 uppercase">THE LENDER</p>
            <p className="mb-2">
              <strong>{contractData.lenderName}</strong>, a company incorporated in England and Wales with company registration number {lender.registrationNumber || '[Registration Number]'}, 
              having its registered office at:
            </p>
            <div className="ml-4 p-3 bg-gray-50 border">
              <pre className="whitespace-pre-wrap text-sm">{contractData.lenderAddress}</pre>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              (hereinafter referred to as the "Lender", which expression shall include its successors, assigns, and legal representatives)
            </p>
          </div>
          
          <div className="text-center text-xl font-semibold my-6">AND</div>
          
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-bold text-lg mb-2 uppercase">THE BORROWER</p>
            <p className="mb-2">
              <strong>Mr./Ms. {contractData.borrowerName}</strong>, a person of full age and capacity, residing at:
            </p>
            <div className="ml-4 p-3 bg-gray-50 border">
              <pre className="whitespace-pre-wrap text-sm">{contractData.borrowerAddress}</pre>
              <p className="text-sm mt-2">United Kingdom</p>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              (hereinafter referred to as the "Borrower")
            </p>
          </div>
          
          <div className="text-center text-xl font-semibold my-6">AND</div>
          
          <div className="border-l-4 border-gray-400 pl-4">
            <p className="font-bold text-lg mb-2 uppercase">THE GUARANTOR</p>
            <p className="mb-2">
              <strong>{contractData.guarantorName}</strong>, a person of full age and capacity, residing at:
            </p>
            <div className="ml-4 p-3 bg-gray-50 border">
              <pre className="whitespace-pre-wrap text-sm">{contractData.guarantorAddress}</pre>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              (hereinafter referred to as the "Guarantor")
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
          The Borrower, Guarantor, and Lender are collectively referred to as the "Parties" to this Agreement.
        </p>
      </div>

      {/* Recitals */}
      <div className="recitals mb-8 no-page-break">
        <h2 className="text-xl font-bold mb-6 text-center uppercase">RECITALS</h2>
        <div className="space-y-4">
          {template.recitals.map((recital, index) => (
            <div key={index} className="flex">
              <span className="font-bold text-lg mr-4 mt-1 min-w-[2rem]">{recital.letter}.</span>
              <p className="text-justify flex-1 leading-relaxed">
                {populateTemplateVariables(recital.content, contractData)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border-2 border-gray-300 bg-gray-50">
          <p className="text-sm text-center font-semibold">
            NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, 
            and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, 
            the Parties agree as follows:
          </p>
        </div>
      </div>

      {/* Contract Sections */}
      {populatedSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="contract-section mb-8">
          <h2 className="text-xl font-bold mb-6 uppercase border-b-2 border-black pb-2">
            <span className="section-number">{section.number}.</span> {section.title}
          </h2>
          
          {section.subsections.map((subsection, subsectionIndex) => (
            <div key={subsectionIndex} className="subsection mb-6">
              <h3 className="font-bold mb-3 text-base">
                {subsection.number} {subsection.title}
              </h3>
              
              <div className="ml-4">
                {/* Special handling for Repayment Schedule section */}
                {section.number === "9" && subsection.title === "Installment Schedule" ? (
                  <div className="no-page-break">
                    <p className="mb-4 text-justify">
                      The repayment schedule for this loan agreement is set forth in the table below. 
                      Each installment payment is due on the specified date and consists of both principal and interest components:
                    </p>
                    <RepaymentScheduleTable />
                  </div>
                ) : (
                  <>
                    <p className="mb-3 text-justify leading-relaxed">{subsection.content}</p>
                    {subsection.isList && subsection.listItems && (
                      <ul className="list-none ml-6 space-y-2">
                        {subsection.listItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="mb-2 flex">
                            <span className="mr-3 font-bold">({String.fromCharCode(97 + itemIndex)})</span>
                            <span className="text-justify">{item}</span>
                          </li>
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

      {/* Signature Section */}
      <div className="signature-section mt-16 page-break-before">
        <h2 className="text-xl font-bold mb-8 text-center uppercase">EXECUTION OF AGREEMENT</h2>
        
        <p className="text-justify mb-8 leading-relaxed">
          IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first written above. 
          This Agreement shall be binding upon the Parties, their heirs, successors, and assigns.
        </p>

        {template.signatureBlocks.map((block, index) => (
          <div key={index} className="signature-block mb-8">
            <h3 className="font-bold text-lg mb-6 text-center uppercase border-b border-gray-400 pb-2">
              {block.title}
            </h3>
            
            <div className="grid grid-cols-1 gap-8">
              {block.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="mb-6">
                  <div className="signature-line mb-3"></div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">{field}</p>
                      <p className="text-xs text-gray-600">Signature</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Date:</p>
                      <div className="border-b border-gray-400 h-6 w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {index === 0 && (
              <div className="mt-6 p-4 border border-gray-300 bg-gray-50">
                <p className="text-xs text-center">
                  <strong>Company Details:</strong><br/>
                  {contractData.lenderName}<br/>
                  Registration: {lender.registrationNumber || '[Registration Number]'}<br/>
                  Email: {contractData.lenderEmail} | Phone: {contractData.lenderPhone}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Witness Section */}
        <div className="signature-block mt-12">
          <h3 className="font-bold text-lg mb-6 text-center uppercase border-b border-gray-400 pb-2">
            WITNESS SIGNATURES
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="signature-line mb-3"></div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Witness 1 - Print Name</p>
                <p className="text-xs text-gray-600 mb-3">Signature</p>
                <p className="text-xs">Address: _________________________</p>
                <p className="text-xs mt-1">Date: ____________</p>
              </div>
            </div>
            
            <div>
              <div className="signature-line mb-3"></div>
              <div className="text-sm">
                <p className="font-semibold mb-1">Witness 2 - Print Name</p>
                <p className="text-xs text-gray-600 mb-3">Signature</p>
                <p className="text-xs">Address: _________________________</p>
                <p className="text-xs mt-1">Date: ____________</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="document-footer mt-12 print-no-break">
        <div className="border-t-2 border-gray-400 pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <p className="font-semibold mb-2">Document Information</p>
              <p className="text-xs mb-1">Generated: {formatDate(new Date())}</p>
              <p className="text-xs mb-1">Contract ID: {contractData.contractRef}</p>
              <p className="text-xs mb-1">Version: 1.0</p>
              <p className="text-xs">Status: EXECUTED</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center rounded-full border-4 border-yellow-600">
                <span className="text-black font-bold text-2xl">TSK</span>
              </div>
              <p className="text-xs mt-2 font-semibold">OFFICIAL SEAL</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold mb-2">Contact Information</p>
              <p className="text-xs mb-1">TechSkillUK Ltd</p>
              <p className="text-xs mb-1">education@techskilluk.com</p>
              <p className="text-xs mb-1">+44 (0) 20 1234 5678</p>
              <p className="text-xs">www.techskilluk.com</p>
            </div>
          </div>
          
          <div className="text-center border-t border-gray-300 pt-4">
            <p className="text-xs text-gray-500 mb-2">
              This is a legally binding agreement. Both parties should retain a copy for their records.
            </p>
            <p className="text-xs font-semibold">
              © {new Date().getFullYear()} TechSkillUK Ltd - Professional Education Funding Solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});