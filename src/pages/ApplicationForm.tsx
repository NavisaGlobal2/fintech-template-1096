import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const applicationSchema = z.object({
  // Applicant Information
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters').max(20, 'Phone must be less than 20 characters'),
  proofOfAddress: z.any().refine((file) => file?.length > 0, 'Proof of address is required'),
  loanAmount: z.string().min(1, 'Please select a loan amount'),
  loanPurpose: z.string().min(10, 'Purpose must be at least 10 characters').max(500, 'Purpose must be less than 500 characters'),
  
  // Immigration Status
  immigrationStatus: z.string().min(1, 'Please select your immigration status'),
  immigrationDocument: z.any().refine((file) => file?.length > 0, 'Immigration document is required'),
  
  // Identity Verification
  governmentId: z.any().refine((file) => file?.length > 0, 'Government ID is required'),
  
  // Employment Status
  employmentStatus: z.string().min(1, 'Please select your employment status'),
  employerIncome: z.string().optional(),
  
  // Guarantor Information
  guarantorName: z.string().min(2, 'Guarantor name is required'),
  guarantorEmail: z.string().email('Invalid email address'),
  guarantorPhone: z.string().min(10, 'Phone must be at least 10 characters'),
  guarantorProofOfAddress: z.any().refine((file) => file?.length > 0, 'Guarantor proof of address is required'),
  guarantorId: z.any().refine((file) => file?.length > 0, 'Guarantor ID is required'),
  guarantorEmploymentStatus: z.string().min(1, 'Please select guarantor employment status'),
  
  // Consent
  dataConsent: z.boolean().refine((val) => val === true, 'You must consent to data processing'),
  guarantorConsent: z.boolean().refine((val) => val === true, 'You must confirm guarantor agreement'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const { toast } = useToast();
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      dataConsent: false,
      guarantorConsent: false,
    }
  });

  const onSubmit = (data: ApplicationFormData) => {
    console.log('Application submitted:', data);
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you within 24-48 hours.",
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Loan Application
          </h1>
          <p className="text-xl text-foreground/70">
            Tell us about yourself so we can find the best loan options for you.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Applicant Information */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Applicant Information</h2>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 7700 900000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="proofOfAddress"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Proof of Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select amount" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="300">£300</SelectItem>
                          <SelectItem value="500">£500</SelectItem>
                          <SelectItem value="1000">£1,000</SelectItem>
                          <SelectItem value="1500">£1,500</SelectItem>
                          <SelectItem value="2000">£2,000</SelectItem>
                          <SelectItem value="2500">£2,500</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="loanPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us what you'll use the loan for..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Immigration Status */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Immigration Status</h2>
              
              <FormField
                control={form.control}
                name="immigrationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immigration Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="work-permit">Work Permit</SelectItem>
                        <SelectItem value="permanent-residence">Permanent Residence</SelectItem>
                        <SelectItem value="refugee">Refugee Status</SelectItem>
                        <SelectItem value="asylum">Asylum Seeker</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="immigrationDocument"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Immigration Document *</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Identity Verification */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Identity Verification</h2>
              
              <FormField
                control={form.control}
                name="governmentId"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Government ID (Passport, Driver's License, National ID) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Employment Status */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Employment Status</h2>
              
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employerIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer/Income Source (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name or income source" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guarantor Information */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Guarantor Information</h2>
              
              <FormField
                control={form.control}
                name="guarantorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guarantor Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="guarantorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guarantor Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guarantorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guarantor Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 7700 900000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guarantorProofOfAddress"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Guarantor Proof of Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guarantorId"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Guarantor ID *</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guarantorEmploymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guarantor Employment Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Consent */}
            <div className="space-y-6 p-8 bg-card rounded-[2rem] border border-border">
              <h2 className="text-2xl font-bold text-foreground">Consent</h2>
              
              <FormField
                control={form.control}
                name="dataConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to the processing of my personal data for loan assessment purposes *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guarantorConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I confirm that my guarantor has agreed to act as a guarantor for this loan *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full rounded-full text-lg h-16"
            >
              Submit Application
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
