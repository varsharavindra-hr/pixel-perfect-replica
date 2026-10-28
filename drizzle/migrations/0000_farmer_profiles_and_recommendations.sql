CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 name text NOT NULL DEFAULT '',
 language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','kn')),
 village text NOT NULL DEFAULT '',
 taluk text NOT NULL DEFAULT '',
 farm_details jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_read_own ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE FUNCTION public.create_farmer_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$ BEGIN INSERT INTO public.profiles (id) VALUES (NEW.id); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.create_farmer_profile() FROM PUBLIC;
CREATE TRIGGER on_farmer_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_farmer_profile();
CREATE TABLE public.saved_recommendations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
 crop_id text NOT NULL,
 farm_input jsonb NOT NULL,
 result jsonb NOT NULL,
 saved_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.saved_recommendations TO authenticated;
GRANT ALL ON public.saved_recommendations TO service_role;
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY recommendations_read_own ON public.saved_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY recommendations_insert_own ON public.saved_recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY recommendations_delete_own ON public.saved_recommendations FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX saved_recommendations_owner ON public.saved_recommendations(user_id, saved_at DESC);