import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, DollarSign, Building } from 'lucide-react';
import { FinancialInfo } from '@/types/loanApplication';

interface FinancialInfoEditorProps {
  data: Partial<FinancialInfo>;
  onSave: (data: FinancialInfo) => void;
  onCancel: () => void;
}

const FinancialInfoEditor: React.FC<FinancialInfoEditorProps> = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FinancialInfo>({
    householdIncome: data?.householdIncome || '',
    dependents: data?.dependents || 0,
    bankAccount: {
      bankName: data?.bankAccount?.bankName || '',
      accountType: data?.bankAccount?.accountType || '',
      accountNumber: data?.bankAccount?.accountNumber || '',
      sortCode: data?.bankAccount?.sortCode || '',
    },
    bankStatements: data?.bankStatements || {
      uploaded: false,
      verified: false,
    },
    existingLoans: data?.existingLoans || '',
    otherIncome: data?.otherIncome || '',
  });

  const handleInputChange = (field: keyof FinancialInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankAccountChange = (field: keyof FinancialInfo['bankAccount'], value: string) => {
    setFormData(prev => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Income Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="householdIncome">Household Income (Annual)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="householdIncome"
                  type="number"
                  value={formData.householdIncome}
                  onChange={(e) => handleInputChange('householdIncome', e.target.value)}
                  className="pl-8"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                type="number"
                min="0"
                value={formData.dependents}
                onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="otherIncome">Other Income Sources</Label>
              <Textarea
                id="otherIncome"
                value={formData.otherIncome}
                onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                placeholder="Describe any other sources of income..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Banking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankAccount.bankName}
                onChange={(e) => handleBankAccountChange('bankName', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select 
                value={formData.bankAccount.accountType} 
                onValueChange={(value) => handleBankAccountChange('accountType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sortCode">Sort Code / Routing Number</Label>
                <Input
                  id="sortCode"
                  value={formData.bankAccount.sortCode}
                  onChange={(e) => handleBankAccountChange('sortCode', e.target.value)}
                  className="mt-1"
                  placeholder="000000"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
                <Input
                  id="accountNumber"
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) => handleBankAccountChange('accountNumber', e.target.value)}
                  className="mt-1"
                  placeholder="****1234"
                  maxLength={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Obligations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Existing Financial Obligations</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="existingLoans">Existing Loans & Debts</Label>
            <Textarea
              id="existingLoans"
              value={formData.existingLoans}
              onChange={(e) => handleInputChange('existingLoans', e.target.value)}
              placeholder="Describe any existing loans, credit card debts, or other financial obligations..."
              className="mt-1"
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Please include loan amounts, monthly payments, and remaining balances where applicable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default FinancialInfoEditor;
