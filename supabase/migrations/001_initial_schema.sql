-- =============================================================
-- AI 기반 사업 아이디어 큐레이션 플랫폼 - Initial Schema
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLE: public.users
-- Supabase auth.users 확장. is_pro와 lemon_customer_id 포함.
-- auth.users INSERT 트리거가 자동으로 이 테이블에 행을 생성함.
-- =============================================================
CREATE TABLE public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL,
  full_name             TEXT,
  avatar_url            TEXT,
  lemon_customer_id     TEXT UNIQUE,           -- Lemon Squeezy Customer ID
  is_pro                BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 함수 (모든 테이블 공용)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 신규 Auth 유저 가입 시 users 테이블 자동 행 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================
-- TABLE: public.ideas
-- n8n 파이프라인이 AI로 정제한 사업 아이디어 저장.
-- TEXT[] 배열 타입으로 pain_points, tags 등 다중 값 저장.
-- =============================================================
CREATE TABLE public.ideas (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- AI 생성 콘텐츠
  title                     TEXT NOT NULL,
  summary                   TEXT NOT NULL,                    -- 2문장 요약
  pain_points               TEXT[] NOT NULL DEFAULT '{}',     -- 문제점 배열
  target_customers          TEXT[] NOT NULL DEFAULT '{}',     -- 타겟 고객 배열
  monetization_strategies   TEXT[] NOT NULL DEFAULT '{}',     -- 수익화 방안 배열
  tech_stack_suggestions    TEXT[] NOT NULL DEFAULT '{}',     -- 기술 스택 제안 배열
  tags                      TEXT[] NOT NULL DEFAULT '{}',     -- 카테고리 태그 배열

  -- 소스 메타데이터
  source_url                TEXT NOT NULL,
  source_platform           TEXT NOT NULL CHECK (
                              source_platform IN ('reddit', 'indiehackers', 'producthunt')
                            ),
  source_raw_content        TEXT,                             -- 원문 (감사 용도)
  scraped_at                TIMESTAMPTZ,

  -- 참여 지표
  upvotes                   INTEGER DEFAULT 0,
  comment_count             INTEGER DEFAULT 0,
  ai_score                  NUMERIC(3,1),                     -- GPT 품질 점수 (1.0~10.0)

  -- 상태
  is_published              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 태그 배열 GIN 인덱스 (tags @> '{SaaS}' 필터링 최적화)
CREATE INDEX idx_ideas_tags        ON public.ideas USING GIN (tags);
CREATE INDEX idx_ideas_platform    ON public.ideas (source_platform);
CREATE INDEX idx_ideas_created_at  ON public.ideas (created_at DESC);
CREATE INDEX idx_ideas_published   ON public.ideas (is_published) WHERE is_published = TRUE;
CREATE INDEX idx_ideas_source_url  ON public.ideas (source_url);

CREATE TRIGGER ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =============================================================
-- TABLE: public.daily_view_tracking
-- 사용자별 일일 조회수 추적.
-- UNIQUE(user_id, view_date)로 날짜별 1행만 유지.
-- increment_daily_view() RPC로 원자적 증가.
-- =============================================================
CREATE TABLE public.daily_view_tracking (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  view_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  view_count  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_user_view_date UNIQUE (user_id, view_date)
);

CREATE INDEX idx_daily_views_user_date
  ON public.daily_view_tracking (user_id, view_date);

CREATE TRIGGER daily_view_tracking_updated_at
  BEFORE UPDATE ON public.daily_view_tracking
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 원자적 조회수 증가 함수.
-- ON CONFLICT DO UPDATE로 경쟁 조건(Race Condition) 방지.
-- SECURITY DEFINER로 RLS 우회하여 서버 측에서만 호출 가능.
CREATE OR REPLACE FUNCTION public.increment_daily_view(
  p_user_id UUID,
  p_date    DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.daily_view_tracking (user_id, view_date, view_count)
  VALUES (p_user_id, p_date, 1)
  ON CONFLICT (user_id, view_date)
  DO UPDATE SET
    view_count = daily_view_tracking.view_count + 1,
    updated_at = NOW()
  RETURNING view_count INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================
-- TABLE: public.subscriptions
-- Lemon Squeezy 구독 상태를 미러링. Webhook이 이 테이블을 업데이트.
-- lemon_subscription_id UNIQUE로 중복 upsert 방지.
-- =============================================================
CREATE TABLE public.subscriptions (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Lemon Squeezy 식별자
  lemon_subscription_id     TEXT NOT NULL UNIQUE,   -- Lemon Squeezy Subscription ID
  lemon_customer_id         TEXT NOT NULL,           -- Lemon Squeezy Customer ID
  lemon_order_id            TEXT NOT NULL,           -- Lemon Squeezy Order ID
  lemon_product_id          TEXT NOT NULL,           -- Product ID
  lemon_variant_id          TEXT NOT NULL,           -- Variant (Plan) ID

  -- 구독 라이프사이클
  -- Lemon Squeezy 상태: active | paused | cancelled | expired | on_trial | unpaid | past_due
  status                    TEXT NOT NULL CHECK (status IN (
                              'active', 'paused', 'cancelled',
                              'expired', 'on_trial', 'unpaid', 'past_due'
                            )),
  current_period_start      TIMESTAMPTZ NOT NULL,
  current_period_end        TIMESTAMPTZ NOT NULL,
  trial_ends_at             TIMESTAMPTZ,
  renews_at                 TIMESTAMPTZ,
  ends_at                   TIMESTAMPTZ,             -- 취소 예정일 (cancels_at_period_end)

  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id  ON public.subscriptions (user_id);
CREATE INDEX idx_subscriptions_status   ON public.subscriptions (status);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- users: 본인 행만 읽기/수정 가능
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ideas: 인증된 사용자는 published 아이디어 모두 읽기 가능
-- INSERT/UPDATE는 service_role 키만 허용 (n8n ingest API 전용)
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ideas_select_published" ON public.ideas
  FOR SELECT USING (is_published = TRUE);

-- daily_view_tracking: 본인 조회 기록만 접근 가능
ALTER TABLE public.daily_view_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "views_select_own" ON public.daily_view_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- subscriptions: 본인 구독 정보만 접근 가능
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
