
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, CheckCircle, Plus, Minus } from 'lucide-react';
import { FullLoanApplication } from '@/types/loanApplication';
import DocumentUpload from '../DocumentUpload';

interface EducationCareerStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const EducationCareerStep: React.FC<EducationCareerStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [hasEmployment, setHasEmployment] = useState(false);

  const educationCareer = form.watch('educationCareer');

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploading(prev => ({ ...prev, [documentType]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (documentType === 'transcripts') {
        form.setValue('educationCareer.transcripts', {
          uploaded: true,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
          verified: false
        });
      } else if (documentType === 'resume') {
        form.setValue('educationCareer.resume', {
          uploaded: true,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}`,
          verified: false
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const canContinue = educationCareer.highestQualification && 
                     educationCareer.institution && 
                     educationCareer.graduationYear &&
                     educationCareer.transcripts.uploaded &&
                     educationCareer.resume.uploaded;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="educationCareer.highestQualification"
            rules={{ required: "Highest qualification is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highest Qualification</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high-school">High School Diploma</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD/Doctorate</SelectItem>
                    <SelectItem value="professional">Professional Certification</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="educationCareer.institution"
            rules={{ required: "Institution name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter institution name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="educationCareer.graduationYear"
          rules={{ required: "Graduation year is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter graduation year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transcripts Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Academic Transcripts
              {educationCareer.transcripts.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="transcripts"
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxSize={10 * 1024 * 1024}
              onUpload={(file) => handleFileUpload('transcripts', file)}
              isUploading={uploading.transcripts}
              uploadedFile={educationCareer.transcripts.uploaded ? {
                name: educationCareer.transcripts.fileName || '',
                url: educationCareer.transcripts.fileUrl || '',
                verified: educationCareer.transcripts.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload your official academic transcripts or certificates.
            </div>
          </CardContent>
        </Card>

        {/* Resume/CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume/CV
              {educationCareer.resume.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="resume"
              acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
              maxSize={10 * 1024 * 1024}
              onUpload={(file) => handleFileUpload('resume', file)}
              isUploading={uploading.resume}
              uploadedFile={educationCareer.resume.uploaded ? {
                name: educationCareer.resume.fileName || '',
                url: educationCareer.resume.fileUrl || '',
                verified: educationCareer.resume.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload your current resume or CV.
            </div>
          </CardContent>
        </Card>

        {/* Current Employment (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              Current Employment (Optional)
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has-employment" 
                  checked={hasEmployment}
                  onCheckedChange={(checked) => setHasEmployment(checked === true)}
                />
                <label htmlFor="has-employment" className="text-sm font-normal">
                  I am currently employed
                </label>
              </div>
            </CardTitle>
          </CardHeader>
          {hasEmployment && (
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="educationCareer.currentEmployment.company"
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
                  name="educationCareer.currentEmployment.position"
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

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="educationCareer.currentEmployment.startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationCareer.currentEmployment.salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Salary (£)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter annual salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="bg-primary"
          >
            Continue to Program Information
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default EducationCareerStep;
