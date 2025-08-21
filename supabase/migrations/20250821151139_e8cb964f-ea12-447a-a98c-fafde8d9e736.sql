
-- Update the status check constraint to include 'draft' as a valid status
ALTER TABLE loan_applications DROP CONSTRAINT IF EXISTS loan_applications_status_check;

ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_status_check 
CHECK (status IN ('draft', 'pending', 'submitted', 'approved', 'rejected', 'under-review'));
