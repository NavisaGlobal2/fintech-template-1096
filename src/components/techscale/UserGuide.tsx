import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Search, 
  FileText, 
  CheckCircle, 
  DollarSign,
  Clock,
  ArrowRight,
  Target,
  Shield,
  Award
} from 'lucide-react';

const UserGuide: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-medium tracking-tighter">
          How to Use TechScale
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Your complete guide to finding and securing education financing for African students and professionals
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            What TechScale Does
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            TechScale is a comprehensive financing platform that connects African students and professionals 
            with tailored loan options for studying abroad and career development. Our smart matching system 
            evaluates your profile and connects you with the best financing options from trusted lenders.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border">
              <h3 className="font-medium mb-2">🎓 Study Abroad Loans</h3>
              <p className="text-sm text-muted-foreground">
                Traditional loans for university tuition and living expenses
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border">
              <h3 className="font-medium mb-2">💼 Career Microloans</h3>
              <p className="text-sm text-muted-foreground">
                Smaller loans (£500-£7,500) for certifications and upskilling
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border">
              <h3 className="font-medium mb-2">🤝 Sponsor Matching</h3>
              <p className="text-sm text-muted-foreground">
                Connect with diaspora sponsors and grant opportunities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-center">Complete User Journey</h2>
        
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <User className="h-5 w-5" />
              Complete Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Start by providing your background information so we can match you with the most suitable financing options.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Required Information:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Country of origin and destination</li>
                  <li>• Study plans or career goals</li>
                  <li>• Income range and employment status</li>
                  <li>• Loan amount needed</li>
                  <li>• Credit history (if available)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Tips for Better Matches:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be accurate with your income information</li>
                  <li>• Specify your exact study destination</li>
                  <li>• Include co-signer availability if applicable</li>
                  <li>• Choose realistic loan amounts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <Search className="h-5 w-5" />
              Review Your Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our smart algorithm analyzes your profile and presents personalized loan options ranked by eligibility and terms.
            </p>
            
            <div className="space-y-3">
              <h4 className="font-medium">Understanding Your Results:</h4>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Badge className="bg-green-100 text-green-800">Green</Badge>
                  <span className="text-sm">High likelihood of approval - Apply with confidence</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Badge className="bg-yellow-100 text-yellow-800">Yellow</Badge>
                  <span className="text-sm">Moderate eligibility - May need additional documentation</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Badge className="bg-red-100 text-red-800">Red</Badge>
                  <span className="text-sm">Lower eligibility - Consider improving profile or co-signer</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h5 className="font-medium text-blue-900 mb-2">💡 Pro Tip: Credit Readiness Score</h5>
                <p className="text-sm text-blue-800">
                  Check your credit readiness score to understand how to improve your chances with lenders. 
                  We provide specific recommendations to strengthen your application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <FileText className="h-5 w-5" />
              Submit Your Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Complete a comprehensive application for your chosen lender. Our multi-step process ensures accuracy and completeness.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-medium">Application Sections:</h4>
              
              <div className="grid gap-3">
                {[
                  { title: "Personal Information", desc: "Basic details and contact information" },
                  { title: "Identity Verification", desc: "Upload passport and proof of residence" },
                  { title: "Education & Career", desc: "Academic background and employment history" },
                  { title: "Program Details", desc: "Institution and course information" },
                  { title: "Financial Information", desc: "Income, banking, and existing obligations" },
                  { title: "Loan Requirements", desc: "Specific loan type and amount needed" },
                  { title: "Declarations", desc: "Consents and digital signature" }
                ].map((section, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{section.title}</h5>
                      <p className="text-xs text-muted-foreground">{section.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">📋 Required Documents</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Valid passport or national ID</li>
                  <li>• Proof of residence (utility bill or bank statement)</li>
                  <li>• Academic transcripts and certificates</li>
                  <li>• University acceptance letter (for study loans)</li>
                  <li>• Bank statements (3-6 months)</li>
                  <li>• Employment letter or payslips (if applicable)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <Shield className="h-5 w-5" />
              Underwriting & Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our advanced risk engine evaluates your application using multiple factors to determine eligibility and terms.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Assessment Factors:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Income and affordability (30%)</li>
                  <li>• Educational background (25%)</li>
                  <li>• Employment stability (25%)</li>
                  <li>• Co-signer availability (20%)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Possible Outcomes:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Auto-approval (low risk)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>Manual review (medium risk)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-4 w-4 text-red-600 font-bold text-center">×</span>
                    <span>Decline (high risk)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-2">⏱️ Processing Times</h5>
              <p className="text-sm text-purple-800">
                <strong>Auto-approval:</strong> Instant offer generation<br/>
                <strong>Manual review:</strong> 2-5 business days<br/>
                <strong>Document verification:</strong> Additional 1-2 days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                5
              </div>
              <DollarSign className="h-5 w-5" />
              Review & Accept Your Offer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If approved, you'll receive a personalized loan offer with detailed terms and conditions.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-medium">Offer Types Available:</h4>
              
              <div className="grid gap-3">
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <h5 className="font-medium text-blue-900 mb-2">Traditional Loan</h5>
                  <p className="text-sm text-blue-800 mb-2">Fixed monthly payments with competitive APR</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• APR: 6.5% - 12.5% (risk-adjusted)</li>
                    <li>• Term: 3-5 years</li>
                    <li>• Grace period: 3-6 months</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <h5 className="font-medium text-green-900 mb-2">Income Share Agreement (ISA)</h5>
                  <p className="text-sm text-green-800 mb-2">Pay percentage of income after securing employment</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Income share: 8-12%</li>
                    <li>• Term: 5 years</li>
                    <li>• No payments if income below £25,000</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                  <h5 className="font-medium text-purple-900 mb-2">Hybrid Option</h5>
                  <p className="text-sm text-purple-800 mb-2">Combination of traditional loan and ISA</p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• 60% traditional loan + 40% ISA</li>
                    <li>• Lower risk with dual structure</li>
                    <li>• Flexible repayment terms</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
                <h5 className="font-medium text-orange-900 mb-2">⏰ Offer Validity</h5>
                <p className="text-sm text-orange-800">
                  All offers are valid for <strong>14 days</strong> from generation. 
                  Make sure to review and accept within this timeframe to secure your terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                6
              </div>
              <Award className="h-5 w-5" />
              Final Steps & Funding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Once you accept your offer, complete the final verification and receive your funds.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-medium">What Happens Next:</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <ArrowRight className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <h5 className="font-medium text-sm">Contract Signing</h5>
                    <p className="text-xs text-muted-foreground">Digital contract execution with legal terms</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <ArrowRight className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <h5 className="font-medium text-sm">Final Verification</h5>
                    <p className="text-xs text-muted-foreground">Last document checks and enrollment confirmation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <ArrowRight className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <h5 className="font-medium text-sm">Fund Disbursement</h5>
                    <p className="text-xs text-muted-foreground">Direct payment to institution or your account</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <ArrowRight className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <h5 className="font-medium text-sm">Ongoing Support</h5>
                    <p className="text-xs text-muted-foreground">Career services and repayment guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips for Success */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Before You Apply:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Research your target universities thoroughly</li>
                <li>• Calculate total costs including living expenses</li>
                <li>• Gather all required documents in advance</li>
                <li>• Consider finding a co-signer to improve terms</li>
                <li>• Review your credit report if available</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">During the Process:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Provide accurate and complete information</li>
                <li>• Respond promptly to verification requests</li>
                <li>• Compare offers carefully before deciding</li>
                <li>• Ask questions if terms are unclear</li>
                <li>• Keep copies of all documents submitted</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle>🆘 Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <h5 className="font-medium mb-2">Application Support</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Get help with your application process
              </p>
              <Badge variant="secondary">Live Chat Available</Badge>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <h5 className="font-medium mb-2">Technical Issues</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Report bugs or platform problems
              </p>
              <Badge variant="secondary">Email Support</Badge>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border text-center">
              <h5 className="font-medium mb-2">Financial Advice</h5>
              <p className="text-sm text-muted-foreground mb-3">
                Schedule consultation calls
              </p>
              <Badge variant="secondary">Expert Advisors</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserGuide;