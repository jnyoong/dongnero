-- ============================================================
-- 동네로 기업 직접 공고 + 구직카드 시스템
-- Supabase SQL Editor에서 전체 실행
-- ============================================================

-- 1. 기업 직접 공고 테이블
CREATE TABLE IF NOT EXISTS company_jobs (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name    TEXT        NOT NULL,
  contact_email   TEXT        NOT NULL,
  contact_phone   TEXT,
  job_title       TEXT        NOT NULL,
  job_description TEXT        NOT NULL,
  location_sido   TEXT        NOT NULL,
  location_gu     TEXT,
  location_detail TEXT,
  employment_type TEXT,       -- 정규직/계약직/시간제
  salary          TEXT,
  work_hours      TEXT,
  deadline        TEXT,       -- YYYY-MM-DD 또는 '상시모집'
  website         TEXT,
  company_token   UUID        DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status          TEXT        DEFAULT 'pending',  -- pending/approved/rejected
  reject_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_jobs ENABLE ROW LEVEL SECURITY;

-- 누구나 공고 등록 가능
CREATE POLICY "cj_insert" ON company_jobs
  FOR INSERT WITH CHECK (true);

-- 승인된 공고만 공개 조회 가능
CREATE POLICY "cj_select_approved" ON company_jobs
  FOR SELECT USING (status = 'approved');

-- 2. 구직자 카드 테이블
CREATE TABLE IF NOT EXISTS seeker_cards (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT        NOT NULL,
  age_range       TEXT,       -- 50대/60대/70대/80대이상
  location_sido   TEXT        NOT NULL,
  location_gu     TEXT,
  desired_job     TEXT        NOT NULL,
  experience      TEXT,
  skills          TEXT,
  available_time  TEXT,
  contact_phone   TEXT        NOT NULL,
  contact_email   TEXT,
  notes           TEXT,
  is_active       BOOLEAN     DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seeker_cards ENABLE ROW LEVEL SECURITY;

-- 누구나 구직카드 등록 가능
CREATE POLICY "sc_insert" ON seeker_cards
  FOR INSERT WITH CHECK (true);

-- 직접 SELECT 차단 (RPC로만 조회)
CREATE POLICY "sc_no_select" ON seeker_cards
  FOR SELECT USING (false);

-- ============================================================
-- 3. RPC 함수들
-- ============================================================

-- 관리자: 모든 company_jobs 조회 (pending 포함)
CREATE OR REPLACE FUNCTION admin_get_company_jobs(p_pw TEXT)
RETURNS SETOF company_jobs
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_pw != 'dongnero2024' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM company_jobs ORDER BY created_at DESC;
END; $$;

-- 관리자: 공고 상태 변경 (승인/반려)
CREATE OR REPLACE FUNCTION admin_update_company_job(
  p_pw     TEXT,
  p_id     UUID,
  p_status TEXT,
  p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_pw != 'dongnero2024' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  UPDATE company_jobs
    SET status = p_status, reject_reason = p_reason
    WHERE id = p_id;
  RETURN TRUE;
END; $$;

-- 승인된 기업: 구직카드 조회 (company_token 필요)
CREATE OR REPLACE FUNCTION get_seeker_cards_by_token(p_token UUID)
RETURNS TABLE (
  id            UUID,
  name          TEXT,
  age_range     TEXT,
  location_sido TEXT,
  location_gu   TEXT,
  desired_job   TEXT,
  experience    TEXT,
  skills        TEXT,
  available_time TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM company_jobs
    WHERE company_token = p_token AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: approved company not found';
  END IF;
  RETURN QUERY
    SELECT sc.id, sc.name, sc.age_range,
           sc.location_sido, sc.location_gu,
           sc.desired_job, sc.experience, sc.skills,
           sc.available_time, sc.contact_phone, sc.contact_email,
           sc.notes, sc.created_at
    FROM seeker_cards sc
    WHERE sc.is_active = TRUE
    ORDER BY sc.created_at DESC;
END; $$;

-- 관리자: 모든 구직카드 조회
CREATE OR REPLACE FUNCTION admin_get_seeker_cards(p_pw TEXT)
RETURNS SETOF seeker_cards
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_pw != 'dongnero2024' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM seeker_cards ORDER BY created_at DESC;
END; $$;

-- 기업: 자신의 공고 상태 확인 (토큰으로)
CREATE OR REPLACE FUNCTION get_company_job_status(p_token UUID)
RETURNS TABLE (
  job_title     TEXT,
  status        TEXT,
  reject_reason TEXT,
  created_at    TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
    SELECT cj.job_title, cj.status, cj.reject_reason, cj.created_at
    FROM company_jobs cj
    WHERE cj.company_token = p_token;
END; $$;
