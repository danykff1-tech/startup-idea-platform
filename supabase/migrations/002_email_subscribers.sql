-- ────────────────────────────────────────────────────────────
-- 이메일 구독자 + 전송 기록 테이블
-- ────────────────────────────────────────────────────────────

-- 1. 구독자 테이블
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  unsubscribe_token UUID    NOT NULL DEFAULT gen_random_uuid(),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_active
  ON public.email_subscribers (is_active) WHERE is_active = TRUE;

-- 2. 구독자별 전송 기록 (중복 방지용)
CREATE TABLE IF NOT EXISTS public.email_sent_ideas (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID        NOT NULL REFERENCES public.email_subscribers(id) ON DELETE CASCADE,
  idea_id       UUID        NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subscriber_id, idea_id)
);

CREATE INDEX IF NOT EXISTS idx_email_sent_ideas_subscriber
  ON public.email_sent_ideas (subscriber_id);

-- 3. RLS (누구도 직접 접근 불가, service_role 만 사용)
ALTER TABLE public.email_subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sent_ideas    ENABLE ROW LEVEL SECURITY;
-- 정책을 추가하지 않으면 anon/authenticated 는 읽기 불가.
-- /api/subscribe 와 /api/send-daily-email 은 SUPABASE_SERVICE_ROLE_KEY 로 RLS 우회.
