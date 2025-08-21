
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Lock, Mail } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import ESignature from '../ESignature';

interface DeclarationsStepProps {
  form: UseFormReturn<FullLoanApplication>;
  onComplete: () => void;
}

const DeclarationsStep: React.FC<DeclarationsStepProps> = ({ form, onComplete }) => {
  const [showSignature, setShowSignature] = useState(false);

  const declarations = form.watch('declarations');

  const allConsentsGiven = declarations.creditCheckConsent && 
                          declarations.dataPrivacyConsent && 
                          declarations.termsAndConditions;

  const handleSignatureComplete = (signatureData: string) => {
    form.setValue('declarations.signatureImage', signatureData);
    form.setValue('declarations.signatureDate', new Date().toISOString());
    setShowSignature(false);
  };

  const canComplete = allConsentsGiven && declarations.signatureImage;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Declarations & Consent</h3>
          <p className="text-muted-foreground">
            Please review and accept the following terms to complete your application
          </p>
        </div>

        {/* Consent Checkboxes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Required Consents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="declarations.creditCheckConsent"
              rules={{ required: "Credit check consent is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Credit Check Authorization
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      I authorize TechScale and its lending partners to perform credit checks and verify my financial information. 
                      This may include soft and hard credit inquiries to assess my creditworthiness.
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="declarations.dataPrivacyConsent"
              rules={{ required: "Data privacy consent is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Data Privacy & Processing Consent
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      I consent to TechScale collecting, processing, and sharing my personal and financial data with verified lending partners 
                      for loan evaluation purposes. I understand my data will be handled in accordance with GDPR and privacy regulations.
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name="declarations.termsAndConditions"
              rules={{ required: "Terms and conditions acceptance is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Terms & Conditions Agreement
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      I have read and agree to TechScale's{' '}
                      <a href="#" className="text-primary underline">Terms of Service</a>,{' '}
                      <a href="#" className="text-primary underline">Privacy Policy</a>, and{' '}
                      <a href="#" className="text-primary underline">Loan Agreement Terms</a>. 
                      I understand the loan terms, interest rates, and repayment obligations.
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Optional Marketing Consent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Optional Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="declarations.marketingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Marketing Communications (Optional)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      I would like to receive updates about new loan products, educational opportunities, and relevant financial services. 
                      You can unsubscribe at any time.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Digital Signature */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!declarations.signatureImage ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your digital signature is required to complete the loan application
                </p>
                <Button 
                  type="button"
                  onClick={() => setShowSignature(true)}
                  disabled={!allConsentsGiven}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Add Digital Signature
                </Button>
                {!allConsentsGiven && (
                  <p className="text-xs text-muted-foreground">
                    Please accept all required consents above to proceed with signing
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Application Signed</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Signed on {new Date(declarations.signatureDate).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSignature(true)}
                >
                  Update Signature
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Secure & Encrypted</h4>
                <p className="text-sm text-blue-700">
                  Your application and all uploaded documents are encrypted and securely stored. 
                  Only authorized personnel from TechScale and your chosen lender will have access to your information.
                </p>
                <p className="text-sm text-blue-700">
                  Once submitted, you'll receive a confirmation email with your application reference number and next steps.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E-Signature Modal */}
        {showSignature && (
          <ESignature 
            onComplete={handleSignatureComplete}
            onCancel={() => setShowSignature(false)}
          />
        )}

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canComplete}
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Complete Application
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default DeclarationsStep;
