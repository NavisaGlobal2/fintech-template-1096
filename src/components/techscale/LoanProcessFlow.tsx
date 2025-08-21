
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  inputs?: string[];
  outputs?: string[];
  documents?: string[];
  decisions?: string[];
  status: 'pending' | 'active' | 'completed';
}

const LoanProcessFlow = () => {
  const [expandedSteps, setExpandedSteps] = useState<string[]>(['1']);

  const processSteps: ProcessStep[] = [
    {
      id: '1',
      title: 'Interest & Intake Submission',
      description: 'Student submits Finance Request Form',
      inputs: [
        'Full name',
        'Nationality',
        'Contact information',
        'Program/course name',
        'Destination country',
        'Total budget',
        'Loan amount requested',
        'Course start date'
      ],
      documents: [
        'CV (Resume)',
        'Government ID',
        'Admission letter (optional)'
      ],
      outputs: ['Finance Request Form submitted'],
      status: 'completed'
    },
    {
      id: '2',
      title: 'Pre-Qualification Screening',
      description: 'TechScale reviews submission and checks eligibility',
      inputs: [
        'Finance Request Form data',
        'Initial documents'
      ],
      decisions: [
        'Check residency requirements',
        'Verify destination country eligibility',
        'Validate program type',
        'Assess budget alignment'
      ],
      outputs: [
        'Pre-Qualified',
        'Needs More Information',
        'Not Eligible'
      ],
      status: 'active'
    },
    {
      id: '3',
      title: 'Document Collection & KYC',
      description: 'Student uploads additional documents for verification',
      documents: [
        'Government ID/Passport',
        'Proof of admission or intent',
        'Proof of address',
        'Updated CV/Resume',
        'Additional financial documents'
      ],
      inputs: ['Identity verification process'],
      outputs: ['KYC verification completed', 'Affordability assessment'],
      status: 'pending'
    },
    {
      id: '4',
      title: 'Financing Offer Generation',
      description: 'TechScale generates personalized loan offer',
      inputs: ['Verified application data', 'Risk assessment'],
      outputs: [
        'Loan amount offered',
        'Interest rate',
        'Repayment terms',
        'Grace period details',
        'Total cost breakdown',
        'Digital offer document'
      ],
      status: 'pending'
    },
    {
      id: '5',
      title: 'Offer Review & Acceptance',
      description: 'Student reviews and accepts loan terms',
      inputs: ['Digital loan offer'],
      decisions: [
        'Review loan terms',
        'Accept or decline offer',
        'Schedule onboarding call (optional)'
      ],
      outputs: ['Signed loan agreement', 'Onboarding call scheduled'],
      status: 'pending'
    },
    {
      id: '6',
      title: 'Disbursement',
      description: 'TechScale disburses funds to appropriate parties',
      inputs: ['Signed loan agreement', 'Disbursement instructions'],
      outputs: [
        'Funds sent to training provider/institution',
        'Direct payment to student (eligible items)',
        'Confirmation sent to TechSkillUK',
        'Disbursement receipt'
      ],
      status: 'pending'
    },
    {
      id: '7',
      title: 'Ongoing Support & Repayment Monitoring',
      description: 'Continuous support and repayment management',
      inputs: ['Active loan account'],
      outputs: [
        'Repayment reminders',
        'Access to repayment dashboard',
        'Customer support access',
        'Deferment request handling',
        'Status tracking updates'
      ],
      status: 'pending'
    }
  ];

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getStatusIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'active':
        return 'border-blue-500 bg-blue-50';
      case 'pending':
        return 'border-border bg-background';
    }
  };

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Loan Application Process Flow
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            End-to-end loan request process for TechScale Bugeria Ltd students applying through TechSkillUK
          </p>
        </div>

        <div className="space-y-6">
          {processSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection Arrow */}
              {index < processSteps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-12 bg-border z-0"></div>
              )}
              
              <div className={`relative border-2 rounded-lg ${getStatusColor(step.status)} transition-all duration-200`}>
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                          {step.id}
                        </div>
                        {getStatusIcon(step.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {index < processSteps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      {expandedSteps.includes(step.id) ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedSteps.includes(step.id) && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                      {step.inputs && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Required Inputs</span>
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {step.inputs.map((input, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                <span>{input}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.documents && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Required Documents</span>
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {step.documents.map((doc, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.decisions && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Decision Points</span>
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {step.decisions.map((decision, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{decision}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {step.outputs && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Outputs</span>
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {step.outputs.map((output, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{output}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Process Summary */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium text-foreground mb-4">Process Overview</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">Key Partners</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• TechScale Bugeria Ltd</li>
                <li>• TechSkillUK</li>
                <li>• Training Providers</li>
                <li>• Educational Institutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Typical Timeline</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Application: 1-2 days</li>
                <li>• Review & KYC: 3-5 days</li>
                <li>• Offer Generation: 2-3 days</li>
                <li>• Disbursement: 1-2 days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Support Available</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 24/7 Customer Support</li>
                <li>• Dedicated Account Manager</li>
                <li>• Online Dashboard Access</li>
                <li>• Mobile App Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessFlow;
