"""
동네로 정보게시판 정적 HTML 빌더
- posts_data.js를 읽어 /posts/{id}.html 생성 (검색엔진 색인용)
- sitemap.xml에 포스트 URL 자동 등재
- 사용: python build_posts.py
"""

import re, os, sys
from pathlib import Path
from datetime import date

sys.stdout.reconfigure(encoding="utf-8")

# ── 설정 ──────────────────────────────────────────────────────────────────────
SITE_URL   = "https://dongnero.kr"
POSTS_DIR  = Path("posts")
SITEMAP    = Path("sitemap.xml")
GA_ID      = "G-PYD0Q5NTPD"
NAVER_META = "90a8d7a74a69eefe477271e8edb985c9c385f316"

# ── posts_data.js 파싱 ────────────────────────────────────────────────────────
def parse_posts():
    src = Path("posts_data.js").read_text(encoding="utf-8")

    id_matches     = list(re.finditer(r"id:\s*'([^']+)'", src))
    content_starts = [m.end() for m in re.finditer(r"content:\s*`", src)]

    posts = []
    for idx, id_m in enumerate(id_matches):
        post_id  = id_m.group(1)
        id_pos   = id_m.start()
        next_pos = id_matches[idx + 1].start() if idx + 1 < len(id_matches) else len(src)

        cs = [s for s in content_starts if id_pos < s < next_pos]
        if not cs:
            continue
        c_start = cs[0]
        c_end   = src.find("`", c_start)
        content = src[c_start:c_end].strip()

        block = src[id_pos:c_end]

        def field(name):
            m = re.search(rf"{name}:\s*'([^']*)'", block)
            return m.group(1) if m else ""

        posts.append({
            "id":            post_id,
            "category":      field("category"),
            "categoryColor": field("categoryColor"),
            "title":         field("title"),
            "summary":       field("summary"),
            "date":          field("date"),
            "author":        field("author"),
            "content":       content,
        })

    return posts


# ── HTML 템플릿 ───────────────────────────────────────────────────────────────
def build_html(post):
    url   = f"{SITE_URL}/posts/{post['id']}.html"
    color = post.get("categoryColor", "#2563EB")
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{post['title']} — 동네로</title>
  <meta name="description" content="{post['summary']}" />
  <meta name="naver-site-verification" content="{NAVER_META}" />
  <link rel="canonical" href="{url}" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />

  <!-- OG / SNS -->
  <meta property="og:type"        content="article" />
  <meta property="og:title"       content="{post['title']}" />
  <meta property="og:description" content="{post['summary']}" />
  <meta property="og:url"         content="{url}" />
  <meta property="og:site_name"   content="동네로" />
  <meta property="og:locale"      content="ko_KR" />
  <meta property="article:published_time" content="{post['date']}T09:00:00+09:00" />

  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --bg:      #FFF9F4;
      --surface: #FFFFFF;
      --border:  #EDE5DC;
      --text:    #1C1917;
      --sec:     #6B6560;
      --blue:    #2563EB;
      --purple:  #7C3AED;
      --radius:  14px;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
    }}

    /* 상단 네비게이션 */
    .topbar {{
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 10;
    }}
    .topbar-logo {{
      font-size: 1.1rem;
      font-weight: 900;
      color: #FF6B35;
      text-decoration: none;
    }}
    .topbar-link {{
      font-size: .82rem;
      color: var(--blue);
      text-decoration: none;
      font-weight: 600;
    }}

    /* 본문 영역 */
    .wrapper {{
      max-width: 680px;
      margin: 0 auto;
      padding: 24px 20px 60px;
    }}

    /* 카테고리 + 날짜 */
    .post-meta {{
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }}
    .post-cat {{
      font-size: .72rem;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      color: #fff;
      background: {color};
    }}
    .post-date {{
      font-size: .78rem;
      color: var(--sec);
    }}

    /* 제목 */
    h1 {{
      font-size: 1.5rem;
      font-weight: 900;
      line-height: 1.4;
      margin-bottom: 12px;
      word-break: keep-all;
    }}
    @media (max-width: 480px) {{
      h1 {{ font-size: 1.25rem; }}
    }}

    /* 요약 */
    .post-summary {{
      font-size: .95rem;
      color: var(--sec);
      line-height: 1.8;
      border-left: 3px solid {color};
      padding-left: 14px;
      margin-bottom: 28px;
    }}

    /* 본문 */
    .post-body {{ font-size: .95rem; }}
    .post-body h3 {{
      font-size: 1.05rem;
      font-weight: 800;
      margin: 28px 0 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--border);
    }}
    .post-body p  {{ margin-bottom: 14px; line-height: 1.85; }}
    .post-body ul {{ margin: 10px 0 14px 20px; }}
    .post-body li {{ margin-bottom: 6px; line-height: 1.8; }}
    .post-body strong {{ font-weight: 700; }}
    .post-body em {{ font-style: italic; color: var(--sec); }}

    /* 컴포넌트 클래스 (info.html과 동일) */
    .post-tip {{
      background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px;
      padding: 12px 14px; margin: 12px 0;
      font-size: .88rem; line-height: 1.7; color: #1E40AF;
    }}
    .post-example {{
      background: #F8F5FF; border: 1px solid #DDD6FE; border-radius: 10px;
      padding: 14px 16px; margin: 12px 0;
      font-size: .9rem; line-height: 1.7; color: var(--text);
      font-style: italic;
    }}
    .post-example-label {{
      font-size: .72rem; font-weight: 800; color: var(--purple);
      letter-spacing: .5px; margin-bottom: 8px; font-style: normal;
    }}
    .post-compare {{ display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }}
    .post-compare-row {{
      display: flex; flex-direction: column; gap: 4px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 12px;
    }}
    .post-compare-before {{
      font-size: .88rem; color: #DC2626;
      background: #FEF2F2; border-radius: 6px; padding: 6px 10px;
    }}
    .post-compare-after {{
      font-size: .88rem; color: #15803D;
      background: #F0FDF4; border-radius: 6px; padding: 6px 10px;
    }}

    /* 하단 CTA */
    .post-footer {{
      margin-top: 40px;
      padding: 20px;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      text-align: center;
    }}
    .post-footer p {{ font-size: .88rem; color: var(--sec); margin-bottom: 12px; }}
    .btn-primary {{
      display: inline-block;
      background: #FF6B35;
      color: #fff;
      font-size: .9rem;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 8px;
      text-decoration: none;
      margin: 4px;
    }}
    .btn-secondary {{
      display: inline-block;
      background: var(--surface);
      color: var(--blue);
      font-size: .9rem;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 8px;
      text-decoration: none;
      border: 1px solid #BFDBFE;
      margin: 4px;
    }}
  </style>
</head>
<body>

<nav class="topbar">
  <a class="topbar-logo" href="{SITE_URL}/">동네로</a>
  <a class="topbar-link" href="{SITE_URL}/info.html">← 정보게시판 전체 보기</a>
</nav>

<div class="wrapper">
  <div class="post-meta">
    <span class="post-cat">{post['category']}</span>
    <span class="post-date">{post['date']}</span>
  </div>

  <h1>{post['title']}</h1>
  <p class="post-summary">{post['summary']}</p>

  <div class="post-body">
    {post['content']}
  </div>

  <div class="post-footer">
    <p>동네로는 50대·60대 시니어·중장년을 위한 취업정보 플랫폼입니다.</p>
    <a class="btn-primary"   href="{SITE_URL}/jobs.html">채용공고 보러 가기 →</a>
    <a class="btn-secondary" href="{SITE_URL}/info.html">취업 정보 더 보기</a>
  </div>
</div>

</body>
</html>"""


# ── sitemap.xml 업데이트 ──────────────────────────────────────────────────────
def update_sitemap(posts):
    today = date.today().isoformat()

    # 기존 sitemap에서 <url> 블록들 유지 (posts/ 항목은 제거 후 재생성)
    existing = SITEMAP.read_text(encoding="utf-8")
    # posts/ 기존 항목 제거
    existing = re.sub(
        r"\s*<url>\s*<loc>[^<]*/posts/[^<]*</loc>.*?</url>",
        "", existing, flags=re.DOTALL
    )
    # </urlset> 앞에 새 포스트 URL 삽입
    post_entries = "\n".join(
        f"""  <url>
    <loc>{SITE_URL}/posts/{p['id']}.html</loc>
    <lastmod>{p['date']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""
        for p in posts
    )
    updated = existing.replace(
        "</urlset>",
        f"\n{post_entries}\n</urlset>"
    )
    SITEMAP.write_text(updated, encoding="utf-8")
    print(f"sitemap.xml 업데이트: {len(posts)}개 포스트 URL 추가")


# ── 메인 ─────────────────────────────────────────────────────────────────────
def main():
    posts = parse_posts()
    print(f"posts_data.js에서 {len(posts)}개 글 파싱 완료")

    POSTS_DIR.mkdir(exist_ok=True)

    for post in posts:
        html = build_html(post)
        out  = POSTS_DIR / f"{post['id']}.html"
        out.write_text(html, encoding="utf-8")
        print(f"  생성: posts/{post['id']}.html  [{post['title'][:30]}]")

    update_sitemap(posts)
    print(f"\n완료: posts/ 폴더에 {len(posts)}개 HTML 파일 생성")


if __name__ == "__main__":
    main()
