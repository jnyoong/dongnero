"""
시니어 취업정보 — 알림 신청 백엔드
실행: uvicorn backend:app --host 0.0.0.0 --port 8000
"""

import sqlite3
from datetime import datetime
from contextlib import contextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

DB_PATH = "notify.db"

app = FastAPI(title="시니어 취업정보 알림 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 운영 시 실제 도메인으로 교체
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ── DB 초기화 ──────────────────────────────────────────
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS subscribers (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                phone      TEXT    NOT NULL,
                age        TEXT,
                region     TEXT    DEFAULT '전체',
                created_at TEXT    NOT NULL
            )
        """)
        conn.commit()


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@app.on_event("startup")
def startup():
    init_db()


# ── 요청 스키마 ────────────────────────────────────────
class NotifyRequest(BaseModel):
    phone:  str
    age:    str
    region: str = "전체"

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = v.replace("-", "").replace(" ", "")
        if not digits.isdigit() or len(digits) < 10 or len(digits) > 11:
            raise ValueError("올바른 전화번호 형식이 아닙니다.")
        return v

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: str) -> str:
        if not v.isdigit() or not (1 <= int(v) <= 120):
            raise ValueError("올바른 나이를 입력해 주세요.")
        return v


# ── 엔드포인트 ─────────────────────────────────────────
@app.post("/api/notify", status_code=201)
def register_notify(data: NotifyRequest):
    """알림 신청 접수"""
    with get_db() as conn:
        conn.execute(
            "INSERT INTO subscribers (phone, age, region, created_at) VALUES (?, ?, ?, ?)",
            (data.phone, data.age, data.region, datetime.now().isoformat(timespec="seconds"))
        )
        conn.commit()
    return {"status": "ok", "message": "알림 신청이 완료되었습니다."}


@app.get("/api/subscribers")
def list_subscribers(secret: str = ""):
    """신청자 목록 조회 (쿼리: ?secret=비밀번호)"""
    if secret != "senior2025":   # 운영 시 환경변수로 교체
        raise HTTPException(status_code=403, detail="접근 권한이 없습니다.")
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, phone, age, region, created_at FROM subscribers ORDER BY id DESC"
        ).fetchall()
    return {"count": len(rows), "data": [dict(r) for r in rows]}


@app.get("/health")
def health():
    return {"status": "ok"}
