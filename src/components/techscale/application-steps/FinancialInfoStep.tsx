
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import DocumentUpload from '../DocumentUpload';

interface FinancialInfoStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const FinancialInfoStep: React.FC<FinancialInfoStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState(false);

  const financialInfo = form.watch('financialInfo');

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      form.setValue('financialInfo.bankStatements', {
        uploaded: true,
        fileName: file.name,
        fileUrl: `/uploads/${file.name}`,
        verified: false
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const canContinue = financialInfo.householdIncome && 
                     financialInfo.bankAccount.bankName && 
                     financialInfo.bankAccount.accountType &&
                     financialInfo.bankStatements.uploaded;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="financialInfo.householdIncome"
            rules={{ required: "Household income is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Household Income (£)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under-20k">Under £20,000</SelectItem>
                    <SelectItem value="20k-35k">£20,000 - £35,000</SelectItem>
                    <SelectItem value="35k-50k">£35,000 - £50,000</SelectItem>
                    <SelectItem value="50k-75k">£50,000 - £75,000</SelectItem>
                    <SelectItem value="75k-100k">£75,000 - £100,000</SelectItem>
                    <SelectItem value="over-100k">Over £100,000</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="financialInfo.dependents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Dependents</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="financialInfo.existingLoans"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Loans/Debts (£)</FormLabel>
              <FormControl>
                <Input placeholder="Enter total existing debt (enter 0 if none)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financialInfo.otherIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Income Sources (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., freelancing, investments" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Banking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="financialInfo.bankAccount.bankName"
                rules={{ required: "Bank name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialInfo.bankAccount.accountType"
                rules={{ required: "Account type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="current">Current Account</SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="student">Student Account</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="financialInfo.bankAccount.sortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="xx-xx-xx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialInfo.bankAccount.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
              <strong>Note:</strong> Your banking information is encrypted and secure. Account details are optional but may help expedite loan processing.
            </div>
          </CardContent>
        </Card>

        {/* Bank Statements Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bank Statements
              {financialInfo.bankStatements.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="bankStatements"
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxSize={10 * 1024 * 1024}
              onUpload={handleFileUpload}
              isUploading={uploading}
              uploadedFile={financialInfo.bankStatements.uploaded ? {
                name: financialInfo.bankStatements.fileName || '',
                url: financialInfo.bankStatements.fileUrl || '',
                verified: financialInfo.bankStatements.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload your bank statements from the last 3 months to verify income and financial stability.
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="bg-primary"
          >
            Continue to Loan Requirements
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default FinancialInfoStep;
