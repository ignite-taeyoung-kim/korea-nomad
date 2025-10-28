-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cities table (everyone can read)
CREATE POLICY "Everyone can view cities" ON public.cities FOR SELECT USING (true);

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for reviews table
CREATE POLICY "Everyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for events table
CREATE POLICY "Everyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can insert events" ON public.events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own events" ON public.events FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for favorites table
CREATE POLICY "Users can view their favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bookmarks table
CREATE POLICY "Users can view their bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);
