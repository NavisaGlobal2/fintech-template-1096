
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

interface ProgramInfoStepProps {
  form: UseFormReturn<FullLoanApplication>;
  applicationId: string | null;
  onComplete: () => void;
}

const ProgramInfoStep: React.FC<ProgramInfoStepProps> = ({ form, applicationId, onComplete }) => {
  const [uploading, setUploading] = useState(false);

  const programInfo = form.watch('programInfo');

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      form.setValue('programInfo.acceptanceLetter', {
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

  const canContinue = programInfo.institution && 
                     programInfo.programName && 
                     programInfo.duration && 
                     programInfo.totalCost &&
                     programInfo.acceptanceLetter.uploaded;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="programInfo.institution"
            rules={{ required: "Institution name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution/University</FormLabel>
                <FormControl>
                  <Input placeholder="Enter institution name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programInfo.programName"
            rules={{ required: "Program name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program/Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter program name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="programInfo.duration"
            rules={{ required: "Program duration is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Duration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="6-months">6 months</SelectItem>
                    <SelectItem value="1-year">1 year</SelectItem>
                    <SelectItem value="2-years">2 years</SelectItem>
                    <SelectItem value="3-years">3 years</SelectItem>
                    <SelectItem value="4-years">4 years</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programInfo.startDate"
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="programInfo.totalCost"
          rules={{ required: "Total cost is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Program Cost (£)</FormLabel>
              <FormControl>
                <Input placeholder="Enter total cost in pounds" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="programInfo.costBreakdown.tuition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tuition Fees (£)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tuition amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programInfo.costBreakdown.livingExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Living Expenses (£)</FormLabel>
                    <FormControl>
                      <Input placeholder="Living costs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="programInfo.costBreakdown.other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Expenses (£)</FormLabel>
                    <FormControl>
                      <Input placeholder="Other costs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Acceptance Letter Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Acceptance Letter
              {programInfo.acceptanceLetter.uploaded && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload
              documentType="acceptanceLetter"
              acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
              maxSize={10 * 1024 * 1024}
              onUpload={handleFileUpload}
              isUploading={uploading}
              uploadedFile={programInfo.acceptanceLetter.uploaded ? {
                name: programInfo.acceptanceLetter.fileName || '',
                url: programInfo.acceptanceLetter.fileUrl || '',
                verified: programInfo.acceptanceLetter.verified || false
              } : null}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Upload your official acceptance letter from the institution.
            </div>
          </CardContent>
        </Card>

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

export default ProgramInfoStep;
