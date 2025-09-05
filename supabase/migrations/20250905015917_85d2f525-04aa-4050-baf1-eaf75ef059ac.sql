-- Add enhanced signature workflow support
-- Add workflow state to loan_contracts
ALTER TABLE loan_contracts 
ADD COLUMN IF NOT EXISTS signature_workflow_status TEXT DEFAULT 'pending_borrower_signature';

-- Add signature order and dependencies to contract_signatures
ALTER TABLE contract_signatures
ADD COLUMN IF NOT EXISTS signature_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS workflow_step INTEGER DEFAULT 1;

-- Create function to update contract workflow status based on signatures
CREATE OR REPLACE FUNCTION update_contract_workflow_status()
RETURNS TRIGGER AS $$
DECLARE
  contract_record RECORD;
  borrower_signed BOOLEAN;
  guarantor_signed BOOLEAN;
  requires_guarantor BOOLEAN;
BEGIN
  -- Get contract information
  SELECT * INTO contract_record FROM loan_contracts WHERE id = NEW.contract_id;
  
  -- Check if guarantor is required
  requires_guarantor := (contract_record.contract_data->>'requiresGuarantor')::BOOLEAN;
  
  -- Check signature status
  SELECT EXISTS(
    SELECT 1 FROM contract_signatures 
    WHERE contract_id = NEW.contract_id 
    AND signer_type = 'borrower' 
    AND status = 'signed'
  ) INTO borrower_signed;
  
  SELECT EXISTS(
    SELECT 1 FROM contract_signatures 
    WHERE contract_id = NEW.contract_id 
    AND signer_type = 'guarantor' 
    AND status = 'signed'
  ) INTO guarantor_signed;
  
  -- Update workflow status based on signatures
  IF borrower_signed AND (NOT requires_guarantor OR guarantor_signed) THEN
    UPDATE loan_contracts 
    SET signature_workflow_status = 'fully_signed',
        status = 'signed',
        signed_at = NOW()
    WHERE id = NEW.contract_id;
  ELSIF borrower_signed AND requires_guarantor AND NOT guarantor_signed THEN
    UPDATE loan_contracts 
    SET signature_workflow_status = 'pending_guarantor_signature'
    WHERE id = NEW.contract_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update workflow status
DROP TRIGGER IF EXISTS trigger_update_contract_workflow_status ON contract_signatures;
CREATE TRIGGER trigger_update_contract_workflow_status
  AFTER INSERT OR UPDATE ON contract_signatures
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_workflow_status();

-- Create function to initialize signature records for a contract
CREATE OR REPLACE FUNCTION initialize_contract_signatures(
  contract_id_param UUID,
  borrower_id UUID,
  borrower_name TEXT,
  borrower_email TEXT,
  guarantor_id UUID DEFAULT NULL,
  guarantor_name TEXT DEFAULT NULL,
  guarantor_email TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert borrower signature record
  INSERT INTO contract_signatures (
    contract_id,
    signer_id,
    signer_type,
    signer_name,
    signer_email,
    status,
    workflow_step
  ) VALUES (
    contract_id_param,
    borrower_id,
    'borrower',
    borrower_name,
    borrower_email,
    'pending',
    1
  ) ON CONFLICT DO NOTHING;
  
  -- Insert guarantor signature record if required
  IF guarantor_id IS NOT NULL THEN
    INSERT INTO contract_signatures (
      contract_id,
      signer_id,
      signer_type,
      signer_name,
      signer_email,
      status,
      workflow_step
    ) VALUES (
      contract_id_param,
      guarantor_id,
      'guarantor',
      guarantor_name,
      guarantor_email,
      'pending',
      2
    ) ON CONFLICT DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;