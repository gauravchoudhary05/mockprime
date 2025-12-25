-- Add plan_name and pro_until columns to profiles table for premium subscription tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_name text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS pro_until timestamp with time zone;

-- Create payments table to track payment history
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  old_plan text,
  new_plan text NOT NULL,
  pro_rata boolean DEFAULT false,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own payments (for creating order records)
CREATE POLICY "Users can insert their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);