
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GraduationCap, Briefcase, Users } from 'lucide-react';
import { FullLoanApplication, LoanTypeRequest } from '@/types/loanApplication';
import { LoanOption } from '@/types/techscale';

interface LoanTypeStepProps {
  form: UseFormReturn<FullLoanApplication>;
  loanOption: LoanOption;
  onComplete: () => void;
}

const LoanTypeStep: React.FC<LoanTypeStepProps> = ({ form, loanOption, onComplete }) => {
  const loanTypeRequest = form.watch('loanTypeRequest');

  const loanTypes = [
    {
      type: 'study-abroad' as LoanTypeRequest,
      title: 'Study Abroad Loan',
      description: 'Funding for international education programs',
      range: '£5,000 - £30,000',
      icon: <GraduationCap className="h-5 w-5" />,
      features: ['Covers tuition and living expenses', 'Flexible repayment terms', 'Grace period during studies']
    },
    {
      type: 'career-microloan' as LoanTypeRequest,
      title: 'Career Microloan',
      description: 'Smaller loans for professional development and skills training',
      range: '£500 - £3,000',
      icon: <Briefcase className="h-5 w-5" />,
      features: ['Quick approval process', 'Lower documentation requirements', 'Short-term repayment']
    },
    {
      type: 'sponsor-match' as LoanTypeRequest,
      title: 'Sponsor Match',
      description: 'Hybrid financing with partial sponsorship opportunities',
      range: 'Variable based on sponsor',
      icon: <Users className="h-5 w-5" />,
      features: ['Potential partial grants', 'Reduced interest rates', 'Mentorship opportunities']
    }
  ];

  const canContinue = loanTypeRequest.type && loanTypeRequest.amount && loanTypeRequest.purpose;

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Choose Your Loan Type</h3>
          <p className="text-muted-foreground">
            Select the loan type that best matches your needs based on your profile from {loanOption.lenderName}
          </p>
        </div>

        {/* Loan Type Selection */}
        <FormField
          control={form.control}
          name="loanTypeRequest.type"
          rules={{ required: "Please select a loan type" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                  {loanTypes.map((loan) => (
                    <div key={loan.type}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={loan.type} id={loan.type} />
                        <Label htmlFor={loan.type} className="cursor-pointer flex-1">
                          <Card className={`transition-all ${field.value === loan.type ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-primary/10 rounded-full">
                                    {loan.icon}
                                  </div>
                                  <div>
                                    <CardTitle className="text-lg">{loan.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{loan.description}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="whitespace-nowrap">
                                  {loan.range}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2">
                                {loan.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loan Amount and Details */}
        {loanTypeRequest.type && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loanTypeRequest.amount"
                  rules={{ required: "Loan amount is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Loan Amount (£)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanTypeRequest.repaymentPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Repayment Term</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select repayment term" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6-months">6 months</SelectItem>
                          <SelectItem value="12-months">12 months</SelectItem>
                          <SelectItem value="24-months">24 months</SelectItem>
                          <SelectItem value="36-months">36 months</SelectItem>
                          <SelectItem value="48-months">48 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="loanTypeRequest.purpose"
                rules={{ required: "Purpose description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe how you will use this loan</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Tuition fees for Master's program at University of Oxford"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="bg-primary"
          >
            Continue to Declarations & Consent
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default LoanTypeStep;
