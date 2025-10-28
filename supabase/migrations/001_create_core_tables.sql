-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  emoji TEXT,
  overall_score DECIMAL(3,1),
  cost_per_month TEXT,
  internet_speed INTEGER,
  nomads_count INTEGER,
  cafe_rating DECIMAL(2,1),
  work_score DECIMAL(2,1),
  quality_score DECIMAL(2,1),
  reviews_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  gallery_images TEXT[],
  currency_code TEXT DEFAULT 'KRW',
  exchange_rate INTEGER DEFAULT 1200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  user_id UUID,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('networking', 'workshop', 'social', 'sports', 'culture')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  creator_id UUID,
  creator_name TEXT,
  participant_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, city_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, city_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_city_id ON public.reviews(city_id);
CREATE INDEX IF NOT EXISTS idx_events_city_id ON public.events(city_id);
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
