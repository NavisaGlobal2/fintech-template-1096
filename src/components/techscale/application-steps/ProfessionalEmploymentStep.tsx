import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Briefcase } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import DocumentUpload from '../DocumentUpload';

interface ProfessionalEmploymentStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const ProfessionalEmploymentStep: React.FC<ProfessionalEmploymentStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const professionalEmployment = form.watch('professionalEmployment');
  const employmentType = form.watch('professionalEmployment.employmentType');

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentType]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const uploadData = {
        uploaded: true,
        fileName: file.name,
        fileUrl: `/uploads/${file.name}`,
        verified: false
      };

      if (documentType === 'employmentLetter') {
        form.setValue('professionalEmployment.employmentLetter', uploadData);
      } else if (documentType === 'paySlips') {
        form.setValue('professionalEmployment.paySlips', uploadData);
      } else if (documentType === 'contractDocument') {
        form.setValue('professionalEmployment.contractDocument', uploadData);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const isEmployed = employmentType && employmentType !== 'unemployed';

  const canContinue = professionalEmployment?.employmentType && 
                     (!isEmployed || (
                       professionalEmployment?.company && 
                       professionalEmployment?.jobTitle && 
                       professionalEmployment?.monthlySalary &&
                       professionalEmployment?.employmentLetter?.uploaded
                     ));

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Professional Employment Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="professionalEmployment.employmentType"
            rules={{ required: "Employment type is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time Employee</SelectItem>
                    <SelectItem value="part-time">Part-time Employee</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="contract">Contract/Freelancer</SelectItem>
                    <SelectItem value="unemployed">Currently Unemployed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalEmployment.workAuthorization"
            rules={{ required: "Work authorization status is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Authorization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work authorization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="citizen">Citizen</SelectItem>
                    <SelectItem value="permanent-resident">Permanent Resident</SelectItem>
                    <SelectItem value="work-visa">Work Visa</SelectItem>
                    <SelectItem value="student-visa">Student Visa</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEmployed && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="professionalEmployment.company"
                rules={{ required: isEmployed ? "Company name is required" : false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalEmployment.jobTitle"
                rules={{ required: isEmployed ? "Job title is required" : false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title/Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="professionalEmployment.employmentDuration"
                rules={{ required: isEmployed ? "Employment duration is required" : false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-6">Less than 6 months</SelectItem>
                        <SelectItem value="6-12">6-12 months</SelectItem>
                        <SelectItem value="1-2-years">1-2 years</SelectItem>
                        <SelectItem value="2-5-years">2-5 years</SelectItem>
                        <SelectItem value="5-plus-years">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="professionalEmployment.monthlySalary"
                rules={{ required: isEmployed ? "Monthly salary is required" : false }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Salary (£)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter monthly salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Employment Letter Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Employment Letter
                  {professionalEmployment?.employmentLetter?.uploaded && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload
                  documentType="employmentLetter"
                  acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                  maxSize={10 * 1024 * 1024}
                  onUpload={(file) => handleFileUpload('employmentLetter', file)}
                  isUploading={uploading.employmentLetter}
                  uploadedFile={professionalEmployment?.employmentLetter?.uploaded ? {
                    name: professionalEmployment.employmentLetter.fileName || '',
                    url: professionalEmployment.employmentLetter.fileUrl || '',
                    verified: professionalEmployment.employmentLetter.verified || false
                  } : null}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  Upload an official letter from your employer confirming employment.
                </div>
              </CardContent>
            </Card>

            {/* Pay Slips Upload (Optional for employed) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Pay Slips (Optional)
                  {professionalEmployment?.paySlips?.uploaded && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload
                  documentType="paySlips"
                  acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                  maxSize={10 * 1024 * 1024}
                  onUpload={(file) => handleFileUpload('paySlips', file)}
                  isUploading={uploading.paySlips}
                  uploadedFile={professionalEmployment?.paySlips?.uploaded ? {
                    name: professionalEmployment.paySlips.fileName || '',
                    url: professionalEmployment.paySlips.fileUrl || '',
                    verified: professionalEmployment.paySlips.verified || false
                  } : null}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  Upload recent pay slips for income verification (optional).
                </div>
              </CardContent>
            </Card>

            {/* Contract Document (for self-employed/contract) */}
            {(employmentType === 'self-employed' || employmentType === 'contract') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Contract/Agreement Document (Optional)
                    {professionalEmployment?.contractDocument?.uploaded && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentUpload
                    documentType="contractDocument"
                    acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
                    maxSize={10 * 1024 * 1024}
                    onUpload={(file) => handleFileUpload('contractDocument', file)}
                    isUploading={uploading.contractDocument}
                    uploadedFile={professionalEmployment?.contractDocument?.uploaded ? {
                      name: professionalEmployment.contractDocument.fileName || '',
                      url: professionalEmployment.contractDocument.fileUrl || '',
                      verified: professionalEmployment.contractDocument.verified || false
                    } : null}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Upload contract or service agreement documents (optional).
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="bg-primary"
          >
            Continue to Financial Information
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ProfessionalEmploymentStep;