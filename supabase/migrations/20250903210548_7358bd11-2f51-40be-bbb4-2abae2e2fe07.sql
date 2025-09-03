-- Create loan_contracts table for storing contract data
CREATE TABLE public.loan_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  application_id UUID REFERENCES public.loan_applications(id),
  offer_id UUID REFERENCES public.loan_offers(id),
  contract_type TEXT NOT NULL DEFAULT 'standard_loan',
  contract_data JSONB NOT NULL DEFAULT '{}',
  contract_pdf_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, ready_for_signature, signed, executed, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  signed_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  template_version TEXT
);

-- Enable Row Level Security
ALTER TABLE public.loan_contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for loan contracts
CREATE POLICY "Users can view their own contracts" 
ON public.loan_contracts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own contract signatures" 
ON public.loan_contracts 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND status IN ('ready_for_signature', 'signed'));

CREATE POLICY "System can create contracts" 
ON public.loan_contracts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all contracts" 
ON public.loan_contracts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contract_signatures table for multi-party signing
CREATE TABLE public.contract_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.loan_contracts(id) ON DELETE CASCADE,
  signer_id UUID NOT NULL,
  signer_type TEXT NOT NULL, -- borrower, co_signer, lender, witness
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signature_data TEXT, -- Base64 encoded signature image
  signed_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, signed, declined
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view signatures for their contracts" 
ON public.contract_signatures 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.loan_contracts lc 
  WHERE lc.id = contract_signatures.contract_id 
  AND lc.user_id = auth.uid()
));

CREATE POLICY "Users can sign their own contracts" 
ON public.contract_signatures 
FOR UPDATE 
USING (signer_id = auth.uid())
WITH CHECK (signer_id = auth.uid());

-- Create payment_methods table for Stripe integration
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_payment_method_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- card, bank_account
  last_four TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own payment methods" 
ON public.payment_methods 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create loan_payments table for payment tracking
CREATE TABLE public.loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  contract_id UUID REFERENCES public.loan_contracts(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  payment_type TEXT NOT NULL, -- setup_fee, monthly_payment, early_payment
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, succeeded, failed, cancelled
  scheduled_date DATE,
  processed_date TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.loan_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" 
ON public.loan_payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage payments" 
ON public.loan_payments 
FOR ALL 
USING (true);

-- Update loan_offers table to add accepted status tracking
ALTER TABLE public.loan_offers ADD COLUMN IF NOT EXISTS accepted_by UUID;
ALTER TABLE public.loan_offers ADD COLUMN IF NOT EXISTS acceptance_conditions JSONB DEFAULT '{}';

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_loan_contracts_updated_at
BEFORE UPDATE ON public.loan_contracts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();