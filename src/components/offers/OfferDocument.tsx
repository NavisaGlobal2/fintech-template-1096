import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  User, 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock, 
  TrendingUp,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface OfferDocumentProps {
  offer: {
    id: string;
    offer_type: string;
    loan_amount: number;
    apr_rate?: number;
    isa_percentage?: number;
    repayment_term_months: number;
    grace_period_months: number;
    repayment_schedule: any;
    terms_and_conditions: any;
    status: string;
    offer_valid_until: string;
    created_at: string;
  };
  borrowerInfo?: {
    name: string;
    email: string;
    address?: string;
  };
  lenderInfo?: {
    name: string;
    address: string;
    registration: string;
  };
  className?: string;
}

export const OfferDocument: React.FC<OfferDocumentProps> = ({
  offer,
  borrowerInfo,
  lenderInfo,
  className = ""
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOfferTypeDisplay = (type: string) => {
    switch (type) {
      case 'loan': return 'Traditional Loan Agreement';
      case 'isa': return 'Income Share Agreement';
      case 'hybrid': return 'Hybrid Loan Agreement';
      default: return 'Loan Agreement';
    }
  };

  return (
    <div className={`bg-white text-black min-h-screen print:min-h-0 ${className}`} id="offer-document">
      {/* Document Header */}
      <div className="p-8 border-b-2 border-primary">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Building className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {lenderInfo?.name || 'TechScale Finance'}
              </h1>
              <p className="text-sm text-gray-600">Loan Offer Document</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Offer #{offer.id.slice(0, 8).toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              Generated: {formatDate(offer.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Document Title */}
      <div className="p-8 text-center bg-gradient-primary/5">
        <h2 className="text-3xl font-bold mb-2">
          {getOfferTypeDisplay(offer.offer_type)}
        </h2>
        <p className="text-xl text-primary font-semibold">
          {formatCurrency(offer.loan_amount)}
        </p>
        <p className="text-gray-600 mt-2">
          Valid until {formatDate(offer.offer_valid_until)}
        </p>
      </div>

      {/* Parties Section */}
      <div className="p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Parties to this Agreement
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Lender</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{lenderInfo?.name || 'TechScale Finance Ltd'}</p>
              <p className="text-sm text-gray-600">
                {lenderInfo?.address || 'London, United Kingdom'}
              </p>
              <p className="text-sm text-gray-600">
                Company Registration: {lenderInfo?.registration || 'TSF123456'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h4 className="font-semibold">Borrower</h4>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{borrowerInfo?.name || 'Loan Applicant'}</p>
              <p className="text-sm text-gray-600">
                {borrowerInfo?.email || 'applicant@email.com'}
              </p>
              <p className="text-sm text-gray-600">
                {borrowerInfo?.address || 'Address on file'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loan Terms Summary */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Loan Terms Summary
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Principal Amount</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(offer.loan_amount)}
              </p>
            </CardContent>
          </Card>

          {offer.apr_rate && (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <Percent className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Annual Percentage Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {offer.apr_rate}%
                </p>
              </CardContent>
            </Card>
          )}

          {offer.isa_percentage && (
            <Card className="bg-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">Income Share Percentage</p>
                <p className="text-2xl font-bold text-primary">
                  {offer.isa_percentage}%
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Repayment Term</p>
              <p className="text-2xl font-bold text-primary">
                {offer.repayment_term_months}
              </p>
              <p className="text-sm text-gray-600">months</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Grace Period</p>
              <p className="text-2xl font-bold text-primary">
                {offer.grace_period_months}
              </p>
              <p className="text-sm text-gray-600">months</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Repayment Schedule */}
      {offer.repayment_schedule && (
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Repayment Schedule
          </h3>

          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {offer.repayment_schedule.monthlyPayment && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Monthly Payment</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(offer.repayment_schedule.monthlyPayment)}
                    </p>
                  </div>
                )}

                {offer.repayment_schedule.totalRepayment && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Total Repayment</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(offer.repayment_schedule.totalRepayment)}
                    </p>
                  </div>
                )}

                {offer.repayment_schedule.firstPaymentDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">First Payment Due</p>
                    <p className="text-lg font-bold text-primary">
                      {formatDate(offer.repayment_schedule.firstPaymentDate)}
                    </p>
                  </div>
                )}
              </div>

              {offer.offer_type === 'isa' && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Income Share Agreement:</strong> Monthly payments will be calculated as {offer.isa_percentage}% 
                    of your gross monthly income. Payments automatically adjust based on your income level 
                    and will pause if income falls below the minimum threshold.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="p-8 bg-gray-50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Terms and Conditions
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          {offer.terms_and_conditions?.benefits && (
            <Card className="bg-white">
              <CardHeader>
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Benefits and Features
                </h4>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {offer.terms_and_conditions.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Requirements */}
          {offer.terms_and_conditions?.eligibilityRequirements && (
            <Card className="bg-white">
              <CardHeader>
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Eligibility Requirements
                </h4>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {offer.terms_and_conditions.eligibilityRequirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Special Conditions */}
          {offer.terms_and_conditions?.specialConditions && (
            <Card className="bg-white md:col-span-2">
              <CardHeader>
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Special Conditions
                </h4>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {offer.terms_and_conditions.specialConditions.map((condition: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-orange-800">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Important Notices */}
      <div className="p-8">
        <h3 className="text-xl font-bold mb-6">Important Notices</h3>
        
        <div className="space-y-4 text-sm">
          <div className="p-4 border-l-4 border-primary bg-blue-50">
            <p><strong>Offer Validity:</strong> This offer is valid until {formatDate(offer.offer_valid_until)} and may be withdrawn at any time before acceptance.</p>
          </div>
          
          <div className="p-4 border-l-4 border-orange-400 bg-orange-50">
            <p><strong>Binding Agreement:</strong> Acceptance of this offer creates a legally binding agreement between the parties.</p>
          </div>
          
          <div className="p-4 border-l-4 border-red-400 bg-red-50">
            <p><strong>Final Verification:</strong> All terms are subject to final credit verification and may be modified based on additional documentation.</p>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="p-8 border-t-2 border-primary bg-gray-50 text-center">
        <p className="text-sm text-gray-600 mb-2">
          This document was generated electronically on {formatDate(new Date().toISOString())}
        </p>
        <p className="text-xs text-gray-500">
          TechScale Finance Ltd - Empowering Education Through Smart Financing
        </p>
      </div>
    </div>
  );
};