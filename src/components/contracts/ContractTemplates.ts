// Professional Education Loan Agreement Template based on TechSkillUK standard

export interface ContractTemplate {
  title: string;
  coverPage: {
    title: string;
    parties: {
      lender: string;
      borrower: string;
      guarantor?: string;
    };
    agreementDate: string;
  };
  recitals: Array<{
    letter: string;
    content: string;
  }>;
  sections: ContractSection[];
  signatureBlocks: SignatureBlock[];
}

export interface ContractSection {
  number: string;
  title: string;
  subsections: ContractSubsection[];
}

export interface ContractSubsection {
  number: string;
  title: string;
  content: string;
  isList?: boolean;
  listItems?: string[];
}

export interface SignatureBlock {
  type: 'lender' | 'borrower' | 'guarantor' | 'witness';
  title: string;
  fields: string[];
}

export const EDUCATION_LOAN_TEMPLATE: ContractTemplate = {
  title: "EDUCATION LOAN AGREEMENT",
  coverPage: {
    title: "EDUCATION LOAN AGREEMENT",
    parties: {
      lender: "TECHSKILLUK LIMITED",
      borrower: "[BORROWER_NAME]",
      guarantor: "[GUARANTOR_NAME]"
    },
    agreementDate: "[AGREEMENT_DATE]"
  },
  recitals: [
    {
      letter: "A",
      content: "The Borrower has requested a loan from the Lender for education-related expenses, including tuition fees, certifications, training, equipment, accommodation, and other related educational costs."
    },
    {
      letter: "B", 
      content: "The Lender has agreed to lend the Borrower the sum of £[LOAN_AMOUNT] subject to the Borrower's compliance with the terms of this Agreement."
    },
    {
      letter: "C",
      content: "The Guarantor has agreed to guarantee repayment of the Borrower's obligations to the Lender."
    },
    {
      letter: "D",
      content: "The Parties wish to record the terms and conditions of their agreement in writing."
    }
  ],
  sections: [
    {
      number: "1",
      title: "LOAN TERMS",
      subsections: [
        {
          number: "1.1",
          title: "Principal Loan Amount",
          content: "£[LOAN_AMOUNT] ([LOAN_AMOUNT_WORDS])."
        },
        {
          number: "1.2",
          title: "Processing Fee",
          content: "A fee of [PROCESSING_FEE_PERCENT]% of the principal (£[PROCESSING_FEE]) shall be charged. The Loan disbursement to the Borrower will therefore be £[NET_DISBURSEMENT]."
        },
        {
          number: "1.3",
          title: "Interest Rate",
          content: "Interest shall accrue on the full loan amount (£[LOAN_AMOUNT]) at the rate of [INTEREST_RATE] per cent ([INTEREST_RATE]%) per month on the reducing balance."
        },
        {
          number: "1.4",
          title: "Loan Term",
          content: "[LOAN_TERM] ([LOAN_TERM_WORDS]) months commencing on [FIRST_PAYMENT_DATE]."
        },
        {
          number: "1.5",
          title: "Repayments",
          content: "The Borrower shall repay the loan in [NUMBER_OF_INSTALLMENTS] instalments of £[INSTALLMENT_AMOUNT] each, consisting of £[PRINCIPAL_PER_INSTALLMENT] principal and £[INTEREST_PER_INSTALLMENT] interest."
        },
        {
          number: "1.6",
          title: "Total Repayable",
          content: "£[TOTAL_REPAYABLE] comprising £[LOAN_AMOUNT] principal and £[TOTAL_INTEREST] interest, in addition to the £[PROCESSING_FEE] processing fee. The Borrower's overall cost of credit is £[TOTAL_COST_OF_CREDIT]."
        },
        {
          number: "1.7",
          title: "Early Repayment",
          content: "The Borrower may repay the loan early in whole or in part without penalty, provided all accrued interest and the processing fee are paid."
        }
      ]
    },
    {
      number: "2",
      title: "REPAYMENT METHOD",
      subsections: [
        {
          number: "2.1",
          title: "Payment Method",
          content: "Repayments shall be made by Direct Debit or bank transfer from the Borrower's nominated UK bank account."
        },
        {
          number: "2.2",
          title: "Payment Details",
          content: "All repayments shall be paid into the following account unless otherwise notified in writing by the Lender:",
          isList: true,
          listItems: [
            "Account Name: TechSkillUK Ltd",
            "Bank: [BANK_NAME]",
            "Sort Code: [SORT_CODE]",
            "Account Number: [ACCOUNT_NUMBER]"
          ]
        },
        {
          number: "2.3",
          title: "Payment Receipt",
          content: "Payments shall be deemed received only when cleared funds are credited to the Lender's account."
        }
      ]
    },
    {
      number: "3",
      title: "EVENTS OF DEFAULT",
      subsections: [
        {
          number: "3.1",
          title: "Default Conditions",
          content: "The Borrower shall be deemed in default if:",
          isList: true,
          listItems: [
            "(a) any repayment is not made on the due date;",
            "(b) the Borrower provides false or misleading information;", 
            "(c) the Borrower becomes bankrupt or insolvent;",
            "(d) the Borrower ceases or threatens to cease to carry on study or employment; or",
            "(e) the Borrower is subject to enforcement action or judgment against their assets."
          ]
        },
        {
          number: "3.2",
          title: "Consequences of Default",
          content: "Upon default:",
          isList: true,
          listItems: [
            "The full outstanding balance (including interest and charges) shall become immediately due and payable;",
            "The Lender may enforce this Agreement directly against the Borrower and/or the Guarantor;",
            "The Lender may report the default to UK credit reference agencies."
          ]
        }
      ]
    },
    {
      number: "4",
      title: "GUARANTOR'S OBLIGATIONS",
      subsections: [
        {
          number: "4.1",
          title: "Guarantee",
          content: "The Guarantor irrevocably and unconditionally guarantees to the Lender the due repayment of the Borrower's obligations."
        },
        {
          number: "4.2",
          title: "Joint and Several Liability",
          content: "The Guarantor agrees to be jointly and severally liable with the Borrower. This means the Lender may pursue the Guarantor for repayment without first demanding payment from the Borrower."
        },
        {
          number: "4.3",
          title: "Immediate Payment Obligation",
          content: "The Guarantor undertakes to pay immediately upon demand any sum due from the Borrower which remains unpaid."
        },
        {
          number: "4.4",
          title: "Guarantor Requirements",
          content: "The Guarantor shall, upon signing this Agreement, provide:",
          isList: true,
          listItems: [
            "Full legal name and residential address;",
            "Valid identification;",
            "Bank account details (account number and sort code);",
            "A recent three-month bank statement demonstrating financial capacity."
          ]
        },
        {
          number: "4.5",
          title: "Continuing Guarantee",
          content: "The Guarantor's obligations remain binding notwithstanding:",
          isList: true,  
          listItems: [
            "Any extension of time or indulgence granted to the Borrower;",
            "Any variation of the loan terms;",
            "Any failure or delay by the Lender in enforcing repayment."
          ]
        },
        {
          number: "4.6",
          title: "Discharge",
          content: "This Guarantee is a continuing obligation and remains in force until the Borrower has discharged all obligations in full."
        }
      ]
    },
    {
      number: "5",
      title: "BORROWER'S DECLARATIONS",
      subsections: [
        {
          number: "5.1",
          title: "Representations and Warranties",
          content: "The Borrower represents and warrants that:",
          isList: true,
          listItems: [
            "He is over 18 years of age;",
            "He resides in the United Kingdom;",
            "All information provided is true and complete;",
            "He understands the repayment obligations and consequences of default."
          ]
        }
      ]
    },
    {
      number: "6",
      title: "CONFIDENTIALITY",
      subsections: [
        {
          number: "6.1",
          title: "Confidential Information",
          content: "The Parties agree to keep confidential all information relating to this Agreement except where disclosure is required by law, regulation, or court order."
        }
      ]
    },
    {
      number: "7",
      title: "GOVERNING LAW AND JURISDICTION",
      subsections: [
        {
          number: "7.1",
          title: "Applicable Law",
          content: "This Agreement is governed by and shall be construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction to resolve any dispute."
        }
      ]
    },
    {
      number: "8", 
      title: "NOTICES",
      subsections: [
        {
          number: "8.1",
          title: "Notice Requirements",
          content: "All notices shall be in writing and delivered personally, sent by recorded delivery, or sent by email to the Parties at their last known addresses."
        }
      ]
    },
    {
      number: "9",
      title: "REPAYMENT SCHEDULE",
      subsections: [
        {
          number: "9.1", 
          title: "Installment Schedule",
          content: "[REPAYMENT_SCHEDULE_TABLE]"
        }
      ]
    },
    {
      number: "10",
      title: "EXECUTION",
      subsections: [
        {
          number: "10.1",
          title: "Signature Authority",
          content: "This Agreement shall be executed by all parties and witnessed as appropriate."
        }
      ]
    }
  ],
  signatureBlocks: [
    {
      type: 'lender',
      title: 'Signed for and on behalf of TechSkillUK Ltd:',
      fields: ['Signature', 'Name', 'Date']
    },
    {
      type: 'borrower', 
      title: 'Signed by the Borrower:',
      fields: ['Signature', 'Name', 'Date']
    },
    {
      type: 'guarantor',
      title: 'Signed by the Guarantor:',
      fields: ['Signature', 'Name', 'Address', 'Bank Account Number', 'Sort Code', 'Date']
    },
    {
      type: 'witness',
      title: "Witness to Guarantor's Signature:",
      fields: ['Signature', 'Name', 'Date']
    }
  ]
};

// Helper functions for contract template manipulation
export const getContractTemplate = (contractType: string): ContractTemplate => {
  switch (contractType) {
    case 'education_loan':
    case 'loan':
    default:
      return EDUCATION_LOAN_TEMPLATE;
  }
};

export const generateContractSections = (
  template: ContractTemplate,
  contractData: any
): ContractSection[] => {
  return template.sections.map(section => ({
    ...section,
    subsections: section.subsections.map(subsection => ({
      ...subsection,
      content: populateTemplateVariables(subsection.content, contractData),
      listItems: subsection.listItems?.map(item => populateTemplateVariables(item, contractData))
    }))
  }));
};

export const populateTemplateVariables = (content: string, data: any): string => {
  return content
    .replace(/\[LOAN_AMOUNT\]/g, data.loanAmount || '[LOAN_AMOUNT]')
    .replace(/\[LOAN_AMOUNT_WORDS\]/g, data.loanAmountWords || '[LOAN_AMOUNT_WORDS]')
    .replace(/\[PROCESSING_FEE_PERCENT\]/g, data.processingFeePercent || '1.5')
    .replace(/\[PROCESSING_FEE\]/g, data.processingFee || '[PROCESSING_FEE]')
    .replace(/\[NET_DISBURSEMENT\]/g, data.netDisbursement || '[NET_DISBURSEMENT]')
    .replace(/\[INTEREST_RATE\]/g, data.interestRate || '[INTEREST_RATE]')
    .replace(/\[LOAN_TERM\]/g, data.loanTerm || '[LOAN_TERM]')
    .replace(/\[LOAN_TERM_WORDS\]/g, data.loanTermWords || '[LOAN_TERM_WORDS]')
    .replace(/\[FIRST_PAYMENT_DATE\]/g, data.firstPaymentDate || '[FIRST_PAYMENT_DATE]')
    .replace(/\[NUMBER_OF_INSTALLMENTS\]/g, data.numberOfInstallments || '[NUMBER_OF_INSTALLMENTS]')
    .replace(/\[INSTALLMENT_AMOUNT\]/g, data.installmentAmount || '[INSTALLMENT_AMOUNT]')
    .replace(/\[PRINCIPAL_PER_INSTALLMENT\]/g, data.principalPerInstallment || '[PRINCIPAL_PER_INSTALLMENT]')
    .replace(/\[INTEREST_PER_INSTALLMENT\]/g, data.interestPerInstallment || '[INTEREST_PER_INSTALLMENT]')
    .replace(/\[TOTAL_REPAYABLE\]/g, data.totalRepayable || '[TOTAL_REPAYABLE]')
    .replace(/\[TOTAL_INTEREST\]/g, data.totalInterest || '[TOTAL_INTEREST]')
    .replace(/\[TOTAL_COST_OF_CREDIT\]/g, data.totalCostOfCredit || '[TOTAL_COST_OF_CREDIT]')
    .replace(/\[BANK_NAME\]/g, data.bankName || 'Tide Bank')
    .replace(/\[SORT_CODE\]/g, data.sortCode || '04-06-05')
    .replace(/\[ACCOUNT_NUMBER\]/g, data.accountNumber || '22106965')
    .replace(/\[BORROWER_NAME\]/g, data.borrowerName || '[BORROWER_NAME]')
    .replace(/\[GUARANTOR_NAME\]/g, data.guarantorName || '[GUARANTOR_NAME]')
    .replace(/\[AGREEMENT_DATE\]/g, data.agreementDate || '[AGREEMENT_DATE]')
    .replace(/\[REPAYMENT_SCHEDULE_TABLE\]/g, data.repaymentScheduleTable || '[REPAYMENT_SCHEDULE_TABLE]');
};