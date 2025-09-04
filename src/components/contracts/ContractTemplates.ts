// Contract template definitions for different loan types

export interface ContractTemplate {
  title: string;
  recitals: string[];
  sections: ContractSection[];
  specialClauses?: string[];
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

export const LOAN_CONTRACT_TEMPLATE: ContractTemplate = {
  title: "LOAN AGREEMENT",
  recitals: [
    "the Borrower has applied for a loan to finance educational or career development expenses;",
    "the Lender has agreed to provide financing subject to the terms and conditions herein;",
    "both parties desire to memorialize their agreement in writing;"
  ],
  sections: [
    {
      number: "3",
      title: "LOAN TERMS",
      subsections: [
        {
          number: "3.1",
          title: "Principal Amount",
          content: "The Lender agrees to lend to the Borrower the principal sum outlined in Schedule A (the \"Loan Amount\")."
        },
        {
          number: "3.2", 
          title: "Interest Rate",
          content: "The Loan shall bear interest at the annual percentage rate (APR) specified in Schedule A, calculated on the outstanding principal balance."
        },
        {
          number: "3.3",
          title: "Repayment Term", 
          content: "The Loan shall be repaid in monthly installments over the term specified in Schedule A."
        }
      ]
    },
    {
      number: "4",
      title: "REPAYMENT OBLIGATIONS",
      subsections: [
        {
          number: "4.1",
          title: "Monthly Payments",
          content: "Borrower shall make monthly payments of principal and interest as specified in Schedule A."
        },
        {
          number: "4.2",
          title: "Payment Due Date",
          content: "Payments are due on the same calendar day of each month, beginning on the date specified in Schedule A."
        },
        {
          number: "4.3",
          title: "Prepayment",
          content: "Borrower may prepay the Loan in whole or in part at any time without penalty."
        }
      ]
    }
  ],
  specialClauses: [
    "This Agreement is subject to applicable consumer protection laws.",
    "Interest calculations are performed on a simple interest basis.",
    "Late payments may incur additional fees as specified in the loan terms."
  ]
};

export const ISA_CONTRACT_TEMPLATE: ContractTemplate = {
  title: "INCOME SHARE AGREEMENT",
  recitals: [
    "the Student seeks funding for educational purposes in exchange for a percentage of future income;",
    "the Investor is willing to provide such funding under the terms of an Income Share Agreement;",
    "both parties understand this is not a loan but an investment in the Student's future earning potential;"
  ],
  sections: [
    {
      number: "3", 
      title: "FUNDING AND INCOME SHARE TERMS",
      subsections: [
        {
          number: "3.1",
          title: "Funding Amount",
          content: "The Investor agrees to provide funding in the amount specified in Schedule A (the \"Funding Amount\")."
        },
        {
          number: "3.2",
          title: "Income Share Percentage", 
          content: "In consideration for the Funding Amount, Student agrees to pay the Income Share Percentage of Adjusted Gross Income as specified in Schedule A."
        },
        {
          number: "3.3",
          title: "Payment Term",
          content: "Income share payments shall continue for the Payment Term specified in Schedule A, subject to the Payment Cap."
        },
        {
          number: "3.4",
          title: "Payment Cap",
          content: "Total payments under this Agreement shall not exceed the Payment Cap specified in Schedule A."
        }
      ]
    },
    {
      number: "4",
      title: "INCOME REPORTING AND VERIFICATION",
      subsections: [
        {
          number: "4.1",
          title: "Income Reporting",
          content: "Student shall provide annual income verification and authorize payroll deduction when available."
        },
        {
          number: "4.2",
          title: "Minimum Income Threshold",
          content: "No payments are required if Student's income falls below the Minimum Income Threshold specified in Schedule A."
        },
        {
          number: "4.3",
          title: "Unemployment Forbearance",
          content: "Payment obligations are suspended during periods of unemployment, but the Payment Term is extended accordingly."
        }
      ]
    }
  ],
  specialClauses: [
    "This Agreement is not a loan and does not accrue interest.",
    "Income share payments are based on gross income before taxes and deductions.",
    "Student may satisfy the obligation early by paying the remaining balance calculation."
  ]
};

export const HYBRID_CONTRACT_TEMPLATE: ContractTemplate = {
  title: "HYBRID FINANCING AGREEMENT", 
  recitals: [
    "the Borrower seeks financing combining traditional loan and income share elements;",
    "the Lender is willing to provide such hybrid financing under the terms herein;",
    "this Agreement combines fixed loan payments with income-contingent payments;"
  ],
  sections: [
    {
      number: "3",
      title: "HYBRID FINANCING STRUCTURE",
      subsections: [
        {
          number: "3.1", 
          title: "Total Financing Amount",
          content: "The total financing consists of two components as specified in Schedule A: the Loan Component and the ISA Component."
        },
        {
          number: "3.2",
          title: "Loan Component Terms",
          content: "The Loan Component bears interest and requires fixed monthly payments as specified in Schedule A."
        },
        {
          number: "3.3",
          title: "ISA Component Terms", 
          content: "The ISA Component requires income-contingent payments based on a percentage of income as specified in Schedule A."
        }
      ]
    },
    {
      number: "4",
      title: "REPAYMENT OBLIGATIONS",
      subsections: [
        {
          number: "4.1",
          title: "Combined Payments",
          content: "Borrower shall make both fixed loan payments and income-contingent ISA payments as specified in Schedule A."
        },
        {
          number: "4.2",
          title: "Payment Coordination",
          content: "Total monthly payments shall not exceed the Payment Cap specified in Schedule A."
        },
        {
          number: "4.3",
          title: "Income Verification",
          content: "Borrower shall provide income verification for ISA component calculations."
        }
      ]
    }
  ],
  specialClauses: [
    "The loan component is subject to standard loan terms and consumer protections.",
    "The ISA component follows income share agreement principles and regulations.", 
    "Combined payment obligations are subject to income-based payment caps."
  ]
};

export const getContractTemplate = (contractType: string): ContractTemplate => {
  switch (contractType) {
    case 'isa':
      return ISA_CONTRACT_TEMPLATE;
    case 'hybrid': 
      return HYBRID_CONTRACT_TEMPLATE;
    case 'loan':
    default:
      return LOAN_CONTRACT_TEMPLATE;
  }
};

export const generateContractSections = (
  template: ContractTemplate,
  contractData: any
): ContractSection[] => {
  // This function can be enhanced to dynamically populate template sections
  // with actual contract data, handling conditional clauses based on loan type
  return template.sections.map(section => ({
    ...section,
    subsections: section.subsections.map(subsection => ({
      ...subsection,
      // Replace placeholder values with actual data
      content: subsection.content
        .replace(/Schedule A/g, 'the terms specified herein')
        .replace(/\$\{(\w+)\}/g, (match, key) => contractData[key] || match)
    }))
  }));
};