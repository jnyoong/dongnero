-- ================================================================
-- 동네로 알림 시스템용 Supabase 테이블
-- Supabase 대시보드 → SQL Editor에서 실행
-- ================================================================

-- 1. 신규 공고 감지용
CREATE TABLE IF NOT EXISTS seen_jobs (
  apply_link  text PRIMARY KEY,
  title       text,
  location    text,
  source      text,
  first_seen  date NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX IF NOT EXISTS seen_jobs_first_seen_idx ON seen_jobs(first_seen);

-- 2. 알림 발송 로그 (중복 방지)
CREATE TABLE IF NOT EXISTS notify_sent_log (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  seeker_card_id  bigint NOT NULL,
  sent_date       date NOT NULL DEFAULT CURRENT_DATE,
  job_count       int,
  region          text,
  UNIQUE (seeker_card_id, sent_date)
);

ALTER TABLE seen_jobs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notify_sent_log  ENABLE ROW LEVEL SECURITY;
