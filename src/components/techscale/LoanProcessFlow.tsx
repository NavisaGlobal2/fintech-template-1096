
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Upload, 
  DollarSign, 
  Eye, 
  Handshake, 
  Send, 
  BarChart3,
  User,
  Home,
  GraduationCap,
  CreditCard,
  FileCheck,
  Phone
} from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  status: 'pending' | 'current' | 'completed';
  description: string;
  icon: React.ReactNode;
  inputs?: string[];
  outputs?: string[];
  documents?: string[];
  decisions?: string[];
}

const LoanProcessFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps: ProcessStep[] = [
    {
      id: 1,
      title: 'Interest & Intake Submission',
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'pending',
      description: 'Student submits Finance Request Form with basic information and optional documents',
      icon: <FileText className="h-5 w-5" />,
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
        'CV (Required)',
        'Government ID (Required)', 
        'Admission letter (Optional)'
      ],
      outputs: ['Finance Request Form submitted', 'Application reference number generated']
    },
    {
      id: 2,
      title: 'Pre-Qualification Screening',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'pending',
      description: 'TechScale reviews submission against eligibility criteria',
      icon: <CheckCircle className="h-5 w-5" />,
      inputs: [
        'Submitted application data',
        'Eligibility criteria checklist'
      ],
      decisions: [
        'Pre-Qualified ✓',
        'Needs More Info ⚠️',
        'Not Eligible ✗'
      ],
      outputs: ['Eligibility status notification', 'Next steps communication']
    },
    {
      id: 3,
      title: 'Document Collection & KYC',
      status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'pending',
      description: 'Student uploads required documents and TechScale conducts verification',
      icon: <Upload className="h-5 w-5" />,
      documents: [
        'Government ID/Passport',
        'Proof of admission or intent',
        'Proof of address',
        'Updated CV',
        'Bank statements (if required)'
      ],
      inputs: [
        'Identity verification',
        'Affordability screening',
        'Document authenticity check'
      ],
      outputs: ['KYC status: Verified/Pending/Rejected', 'Document checklist completion']
    },
    {
      id: 4,
      title: 'Financing Offer Generation',
      status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'pending',
      description: 'TechScale generates and presents personalized loan offer',
      icon: <DollarSign className="h-5 w-5" />,
      inputs: [
        'Verified application data',
        'Risk assessment results',
        'Current interest rates'
      ],
      outputs: [
        'Loan amount approved',
        'Interest rate assigned',
        'Repayment terms',
        'Grace period details',
        'Total cost breakdown'
      ]
    },
    {
      id: 5,
      title: 'Offer Review & Acceptance',
      status: currentStep === 5 ? 'current' : currentStep > 5 ? 'completed' : 'pending',
      description: 'Student reviews and digitally accepts loan offer',
      icon: <Eye className="h-5 w-5" />,
      inputs: [
        'Digital loan offer',
        'Terms and conditions',
        'Repayment calculator'
      ],
      decisions: [
        'Accept Offer ✓',
        'Request Modifications 📝',
        'Decline Offer ✗'
      ],
      outputs: ['Digital acceptance confirmation', 'Onboarding call scheduled (optional)']
    },
    {
      id: 6,
      title: 'Disbursement',
      status: currentStep === 6 ? 'current' : currentStep > 6 ? 'completed' : 'pending',
      description: 'TechScale disburses funds to training provider or student',
      icon: <Send className="h-5 w-5" />,
      inputs: [
        'Signed loan agreement',
        'Institution payment details',
        'Student bank details (if applicable)'
      ],
      outputs: [
        'Funds sent to training provider',
        'Direct payment to student (eligible items)',
        'Confirmation to TechSkillUK',
        'Disbursement receipt'
      ]
    },
    {
      id: 7,
      title: 'Ongoing Support & Repayment',
      status: currentStep === 7 ? 'current' : 'pending',
      description: 'Repayment monitoring and ongoing student support',
      icon: <BarChart3 className="h-5 w-5" />,
      inputs: [
        'Repayment schedule',
        'Student status updates',
        'Payment history'
      ],
      outputs: [
        'Repayment reminders',
        'Dashboard access',
        'Support tickets',
        'Deferment approvals',
        'Status tracking updates'
      ]
    }
  ];

  const getStepIcon = (step: ProcessStep) => {
    const baseClasses = "h-8 w-8 rounded-full flex items-center justify-center text-white";
    
    if (step.status === 'completed') {
      return <div className={`${baseClasses} bg-green-500`}><CheckCircle className="h-5 w-5" /></div>;
    } else if (step.status === 'current') {
      return <div className={`${baseClasses} bg-blue-500`}><Clock className="h-5 w-5" /></div>;
    } else {
      return <div className={`${baseClasses} bg-gray-300`}>{step.icon}</div>;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      current: 'bg-blue-100 text-blue-800', 
      pending: 'bg-gray-100 text-gray-600'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <section className="w-full py-12 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            TechScale Loan Process Flow
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            End-to-end loan request process for students applying through TechSkillUK
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  {getStepIcon(step)}
                  <span className="text-xs mt-2 text-center max-w-[80px]">
                    {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="cosmic-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {steps[currentStep - 1]?.icon}
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </CardTitle>
                {getStatusBadge(steps[currentStep - 1]?.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                {steps[currentStep - 1]?.description}
              </p>

              {steps[currentStep - 1]?.inputs && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Required Inputs
                  </h4>
                  <ul className="space-y-1">
                    {steps[currentStep - 1].inputs.map((input, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                        {input}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {steps[currentStep - 1]?.documents && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Required Documents
                  </h4>
                  <ul className="space-y-1">
                    {steps[currentStep - 1].documents.map((doc, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Upload className="h-3 w-3" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {steps[currentStep - 1]?.decisions && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Possible Outcomes
                  </h4>
                  <ul className="space-y-1">
                    {steps[currentStep - 1].decisions.map((decision, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full" />
                        {decision}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {steps[currentStep - 1]?.outputs && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Expected Outputs
                  </h4>
                  <ul className="space-y-1">
                    {steps[currentStep - 1].outputs.map((output, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                        {output}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Process Overview */}
          <Card className="cosmic-glass">
            <CardHeader>
              <CardTitle>Process Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div 
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentStep === step.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {step.icon}
                        <div>
                          <h5 className="font-medium text-sm">{step.title}</h5>
                          <p className="text-xs text-muted-foreground">
                            {step.description.slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous Step
          </Button>
          <Button 
            onClick={() => setCurrentStep(Math.min(7, currentStep + 1))}
            disabled={currentStep === 7}
            className="bg-primary hover:bg-primary/90"
          >
            Next Step
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Key Information */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">For Students</h4>
              <p className="text-sm text-muted-foreground">
                Clear step-by-step process with transparent requirements and timelines
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">TechScale Bugeria</h4>
              <p className="text-sm text-muted-foreground">
                Streamlined approval process with comprehensive risk assessment
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">TechSkillUK</h4>
              <p className="text-sm text-muted-foreground">
                Real-time updates and confirmation throughout the process
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LoanProcessFlow;
