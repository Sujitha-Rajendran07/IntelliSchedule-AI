CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  schedule TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedules" ON public.schedules
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert schedules" ON public.schedules
  FOR INSERT WITH CHECK (true);