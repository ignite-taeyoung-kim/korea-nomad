-- 보안 수정: Function Search Path Mutable 문제 해결
-- Supabase Dashboard → SQL Editor에서 실행하세요

-- 1. handle_new_user() 함수 수정 (search_path 추가)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE
  SET email = new.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. handle_user_deletion() 함수 수정 (search_path 추가)
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.users WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. update_user_timestamp() 함수 수정 (search_path 추가)
CREATE OR REPLACE FUNCTION public.update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 완료! 이 세 함수의 search_path 경고가 해결됩니다.
