import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile } from '@/types/techscale';
import { Loader } from 'lucide-react';

interface UserIntakeFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const UserIntakeForm: React.FC<UserIntakeFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<UserProfile>();

  const handleSubmit = (data: UserProfile) => {
    onSubmit(data);
  };

  return (
    <Card className="max-w-4xl mx-auto cosmic-glass">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Tell Us About Your Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Country of Origin */}
              <FormField
                control={form.control}
                name="countryOfOrigin"
                rules={{ required: "Please select your country of origin" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Origin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="south-africa">South Africa</SelectItem>
                        <SelectItem value="uganda">Uganda</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                        <SelectItem value="other">Other African Country</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Type */}
              <FormField
                control={form.control}
                name="userType"
                rules={{ required: "Please select your profile type" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student (pursuing education)</SelectItem>
                        <SelectItem value="professional">Professional (career advancement)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Loan Purpose */}
              <FormField
                control={form.control}
                name="loanPurpose"
                rules={{ required: "Please select loan purpose" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="study-abroad">Study Abroad</SelectItem>
                        <SelectItem value="upskilling">Professional Upskilling</SelectItem>
                        <SelectItem value="career-development">Career Development</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Loan Amount */}
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Loan Amount (£)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select amount range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-25k">Under £25,000</SelectItem>
                        <SelectItem value="25k-50k">£25,000 - £50,000</SelectItem>
                        <SelectItem value="50k-100k">£50,000 - £100,000</SelectItem>
                        <SelectItem value="100k-200k">£100,000 - £200,000</SelectItem>
                        <SelectItem value="over-200k">Over £200,000</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Income Range */}
              <FormField
                control={form.control}
                name="incomeRange"
                rules={{ required: "Please select your income range" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income (£)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under-10k">Under £10,000</SelectItem>
                        <SelectItem value="10k-25k">£10,000 - £25,000</SelectItem>
                        <SelectItem value="25k-50k">£25,000 - £50,000</SelectItem>
                        <SelectItem value="50k-100k">£50,000 - £100,000</SelectItem>
                        <SelectItem value="over-100k">Over £100,000</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Status */}
              <FormField
                control={form.control}
                name="employmentStatus"
                rules={{ required: "Please select employment status" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employed-full-time">Full-time Employee</SelectItem>
                        <SelectItem value="employed-part-time">Part-time Employee</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Credit History */}
              <FormField
                control={form.control}
                name="creditHistory"
                rules={{ required: "Please select your credit history" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit History</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit history" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="none">No Credit History</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Co-signer */}
              <FormField
                control={form.control}
                name="hasCoSigner"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>I have a co-signer available</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">
                Additional Information
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Help us find better matches by providing additional details about your educational background.
              </p>
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Institution or University</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., University of Oxford, Harvard Business School" 
                        className="bg-muted/30"
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mentioning prestigious institutions may help you access premium lender programs
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Finding Your Matches...
                </>
              ) : (
                'Find My Loan Options'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserIntakeForm;
