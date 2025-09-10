-- Remove the dangerous INSERT policy that allows users to create their own credit usage records
DROP POLICY IF EXISTS "Users can insert their own credit usage history" ON public.credit_usage_history;

-- The credit_usage_history table should only be written to by system functions like use_credits()
-- Users should only be able to read their own usage history, never insert records directly
-- This prevents fraudulent manipulation of transaction history

-- Verify that the table still has the correct SELECT policy for users to view their own records
-- (This should already exist and remain unchanged)