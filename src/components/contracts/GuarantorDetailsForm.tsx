import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, AlertCircle, Phone, Mail, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';

interface GuarantorDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  relationship: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  dateOfBirth: string;
  nationalId: string;
}

interface GuarantorDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guarantorDetails: GuarantorDetails) => void;
  initialData?: Partial<GuarantorDetails>;
  isRequired?: boolean;
}

const GuarantorDetailsForm: React.FC<GuarantorDetailsFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isRequired = false
}) => {
  const [guarantorData, setGuarantorData] = useState<GuarantorDetails>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      postalCode: initialData?.address?.postalCode || '',
      country: initialData?.address?.country || 'United Kingdom'
    },
    relationship: initialData?.relationship || '',
    occupation: initialData?.occupation || '',
    employer: initialData?.employer || '',
    annualIncome: initialData?.annualIncome || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    nationalId: initialData?.nationalId || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!guarantorData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!guarantorData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guarantorData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!guarantorData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!guarantorData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!guarantorData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!guarantorData.address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    if (!guarantorData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    if (!guarantorData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    if (!guarantorData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(guarantorData);
      toast.success('Guarantor details saved successfully');
      onClose();
    } else {
      toast.error('Please fix the validation errors');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setGuarantorData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setGuarantorData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guarantor Details
              {isRequired && <span className="text-red-500">*</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Guarantor Required</p>
                  <p>This loan requires a guarantor. Please provide complete guarantor information to proceed with the contract.</p>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={guarantorData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full legal name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={guarantorData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <Label htmlFor="nationalId">National ID / Passport Number</Label>
                  <Input
                    id="nationalId"
                    value={guarantorData.nationalId}
                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    placeholder="Enter ID number"
                  />
                </div>

                <div>
                  <Label htmlFor="relationship">Relationship to Borrower *</Label>
                  <Select value={guarantorData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                    <SelectTrigger className={errors.relationship ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="relative">Other Relative</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={guarantorData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="guarantor@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={guarantorData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+44 20 1234 5678"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={guarantorData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street"
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={guarantorData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="London"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">County/State</Label>
                  <Input
                    id="state"
                    value={guarantorData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="Greater London"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={guarantorData.address.postalCode}
                    onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                    placeholder="SW1A 1AA"
                    className={errors.postalCode ? 'border-red-500' : ''}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={guarantorData.address.country} onValueChange={(value) => handleInputChange('address.country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="occupation">Occupation *</Label>
                  <Input
                    id="occupation"
                    value={guarantorData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Software Engineer"
                    className={errors.occupation ? 'border-red-500' : ''}
                  />
                  {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                </div>

                <div>
                  <Label htmlFor="employer">Current Employer</Label>
                  <Input
                    id="employer"
                    value={guarantorData.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Income (GBP)</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={guarantorData.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    placeholder="50000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Guarantor Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuarantorDetailsForm;