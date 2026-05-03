/* 동네로 정보게시판 게시물 데이터
 * 운영자가 직접 편집해서 게시물을 추가/수정합니다.
 * id는 고유한 영문 slug (댓글이 달리면 바꾸지 마세요)
 */
var POSTS_DATA = [
  {
    id: 'resume-ai-2025',
    category: '취업 준비',
    categoryColor: '#2563EB',
    title: 'AI로 이력서 제대로 쓰는 법 — 처음부터 끝까지 따라해 보세요',
    summary: '"이력서를 어떻게 써야 하나" 막막하셨죠? ChatGPT·뤼튼 같은 AI 챗봇에 내 경력을 말하면 깔끔한 이력서를 바로 만들어 줍니다. 컴퓨터가 서툴러도, 경력이 짧아도 전혀 문제없어요. 지원하는 곳에 딱 맞는 이력서 만드는 법을 처음부터 끝까지 알려드릴게요.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['이력서', 'AI', '취업준비', 'ChatGPT', '뤼튼'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
오랜만에 취업을 준비하면서 가장 막막한 게 바로 <strong>이력서</strong>예요.<br>
"뭘 써야 하지?", "너무 오래 쉬어서 경력이 없는데…", "컴퓨터로 어떻게 만들지…"<br>
이런 걱정, 다들 한 번쯤 해보셨을 거예요.
</p>
<p>그런데 요즘은 AI 챗봇에게 내 상황을 말하기만 하면, <strong>몇 분 안에 이력서 초안을 뚝딱 만들어 줍니다.</strong> 직접 타이핑하거나 양식을 찾아 헤맬 필요가 없어요. 이 글에서 그 방법을 처음부터 끝까지 알려드릴게요.</p>

<div class="post-tip">
  📌 이 글에서 배울 수 있는 것<br>
  ① 무료로 쓸 수 있는 AI 도구 소개<br>
  ② 이력서 쓰기 전에 준비할 것<br>
  ③ AI에게 정확히 어떻게 부탁하는지 (복붙 가능한 예시 포함)<br>
  ④ AI가 만든 이력서 다듬는 법<br>
  ⑤ 출력해서 제출하는 방법까지
</div>

<h3>🤖 어떤 AI를 쓰면 되나요?</h3>
<p>모두 <strong>무료</strong>로 쓸 수 있고, 스마트폰에서도 작동해요. 셋 중 하나만 골라 시작하면 됩니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">① 뤼튼 (wrtn.ai) — 입문자에게 가장 추천</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.7;">
      • 카카오톡 계정으로 1분 만에 가입<br>
      • 한국어에 특화되어 어색한 표현이 적음<br>
      • 화면이 직관적이라 처음 써도 쉬움<br>
      • 앱 다운로드: 앱스토어·플레이스토어에서 "뤼튼" 검색
    </div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">② ChatGPT (chat.openai.com) — 가장 유명한 AI</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.7;">
      • 구글 계정으로 가입 가능<br>
      • 전 세계에서 가장 많이 쓰는 AI<br>
      • 무료 버전(GPT-4o mini)으로도 이력서 충분히 작성 가능<br>
      • 앱 다운로드: 앱스토어·플레이스토어에서 "ChatGPT" 검색
    </div>
  </div>
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:6px;">③ 클로드 (claude.ai) — 글쓰기에 강한 AI</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.7;">
      • 구글 계정으로 가입 가능<br>
      • 자연스럽고 품격 있는 문장을 잘 씀<br>
      • 자기소개서 작성에 특히 유용
    </div>
  </div>
</div>

<h3>✏️ STEP 1 — AI에게 말하기 전에 먼저 메모하세요</h3>
<p>AI가 좋은 이력서를 써주려면 <strong>내 정보를 충분히 알아야</strong> 해요. 미리 메모장에 아래 내용을 적어두면 훨씬 쉽게 진행됩니다.</p>

<div class="post-example">
  <div class="post-example-label">✍️ 미리 적어둘 내용 (예시)</div>
  이름: 김○○<br>
  나이: 58세 (1968년생)<br>
  연락처: 010-XXXX-XXXX<br>
  거주지: 서울 노원구<br><br>
  <strong>경력</strong><br>
  - 2018~2022년: ○○마트 계산원 (4년) — 계산, 고객응대, 재고정리<br>
  - 2010~2015년: ○○어린이집 보조교사 (5년) — 아이들 식사·활동 보조<br><br>
  <strong>자격증</strong>: 요양보호사 2급 (2020년 취득)<br>
  <strong>지원하려는 곳</strong>: 편의점 파트타임, 학교 급식실<br>
  <strong>가능한 근무 시간</strong>: 평일 오전 9시~오후 2시
</div>

<div class="post-tip">
  💡 경력이 없어도 괜찮아요! 가사, 자녀 양육, 봉사활동, 부모님 돌봄 경험도 경력으로 쓸 수 있습니다. "경력 없음"이라고 쓰는 것보다 훨씬 좋은 인상을 줘요.
</div>

<h3>💬 STEP 2 — AI에게 이렇게 부탁하세요</h3>
<p>뤼튼이나 ChatGPT를 열고, 아래 예시처럼 말을 걸어보세요. <strong>그냥 말하듯이 써도 돼요.</strong></p>

<div class="post-example">
  <div class="post-example-label">📋 기본 이력서 요청 (이것만 복붙해서 내 정보로 바꾸세요)</div>
  나는 58세 여성이에요. 이력서를 작성해 주세요.<br><br>
  [내 경력]<br>
  - ○○마트에서 4년간 계산원으로 일했어요 (고객 응대, 재고 정리 담당)<br>
  - ○○어린이집에서 5년간 보조교사로 일했어요<br><br>
  [자격증] 요양보호사 2급<br>
  [지원 목적] 편의점 파트타임 지원<br>
  [성격] 성실하고 꼼꼼하며 책임감이 강해요<br><br>
  A4 1장 분량의 깔끔한 이력서로 만들어 주세요. 자기소개 한 단락도 포함해 주세요.
</div>

<p>잠시 기다리면 AI가 이력서 초안을 바로 만들어 줄 거예요. 내용을 읽어보고 맞지 않는 부분은 바로 수정을 요청하면 됩니다.</p>

<div class="post-example">
  <div class="post-example-label">🔧 수정 요청 예시</div>
  "자기소개 부분을 좀 더 따뜻하고 친근한 느낌으로 바꿔줘요."<br>
  "지원 동기를 한 문장 추가해 줘요. 동네 가까운 편의점이라 출퇴근이 쉽다는 내용으로요."<br>
  "전체적으로 더 간결하게 다듬어 줘요."
</div>

<h3>🏆 STEP 3 — 지원하는 곳에 맞게 살짝 바꾸는 요령</h3>
<p>같은 이력서를 어디나 내는 것보다, <strong>지원하는 곳에 맞게 조금씩 맞춤화</strong>하면 합격률이 올라가요. AI에게 이렇게 말해보세요.</p>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">편의점 지원할 때</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"편의점 지원용으로 고객 응대 경험과 빠른 계산 능력을 강조하는 방향으로 자기소개를 다시 써줘요."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">학교 급식실 지원할 때</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"학교 급식실 조리보조 지원용으로 위생 관념, 꼼꼼함, 아이들을 좋아하는 성격을 강조해서 자기소개를 써줘요."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">요양원·복지관 지원할 때</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"요양보호사 자격증과 어르신 돌봄 경험을 앞에 배치하고, 따뜻한 성품을 강조하는 이력서로 다듬어 줘요."</div>
  </div>
</div>

<h3>👀 STEP 4 — AI가 만든 이력서, 꼭 이것만 확인하세요</h3>
<p>AI가 잘 만들어 줘도 내가 한 번 꼼꼼히 읽어봐야 해요. 아래 체크리스트로 확인해 보세요.</p>
<ul>
  <li>✅ 내 이름, 연락처가 정확한가</li>
  <li>✅ 일한 기간(년도)이 실제와 맞는가</li>
  <li>✅ 자격증 이름이 정확한가 (예: 요양보호사 1급인데 2급으로 쓰지는 않았는지)</li>
  <li>✅ 너무 과장된 내용은 없는가 ("20년 경력"처럼 실제와 다른 표현)</li>
  <li>✅ 문장이 자연스럽게 읽히는가</li>
</ul>

<div class="post-tip">
  💡 AI가 가끔 없는 경력을 지어내는 경우가 있어요. 반드시 한 번 읽어보고 실제와 다른 부분은 수정하세요.
</div>

<h3>🖨️ STEP 5 — 완성된 이력서 출력하기</h3>
<p>AI가 완성한 이력서를 <strong>어떻게 출력</strong>하면 될까요?</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:4px;">방법 ① 편의점 무인 출력기 이용</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">GS25, CU, 세븐일레븐 등에 무인 출력기가 있어요.<br>AI 화면을 캡처해서 사진으로 출력하거나, 파일로 저장한 뒤 USB에 넣어 출력 가능해요. 흑백 A4 한 장에 보통 100~150원이에요.</div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:4px;">방법 ② 주민센터·도서관 컴퓨터 이용</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">동네 주민센터나 공공도서관에 무료 컴퓨터와 프린터가 있어요. 직원분께 도움 요청하면 친절히 도와줍니다.</div>
  </div>
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:4px;">방법 ③ 이메일로 바로 제출</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">요즘 많은 곳에서 이메일 지원을 받아요. AI에게 "이메일로 보낼 수 있는 텍스트 형식으로 만들어줘"라고 하면 복사해서 이메일에 붙여 넣을 수 있어요.</div>
  </div>
</div>

<h3>📸 이력서 사진, 이렇게 하면 돼요</h3>
<ul>
  <li>최근 6개월 이내 찍은 증명사진이 가장 좋아요</li>
  <li>사진관 부담스러우면 스마트폰으로 찍어도 OK — 단, <strong>밝은 배경, 단정한 복장</strong>이면 충분해요</li>
  <li>알바·파트타임 지원 시 사진을 꼭 넣지 않아도 되는 경우도 많아요</li>
</ul>

<h3>❓ 자주 묻는 질문</h3>
<ul>
  <li>
    <strong>Q. 경력이 거의 없는데 이력서를 쓸 수 있나요?</strong><br>
    A. 네, 물론이죠. "가사 경력 20년"도 훌륭한 경력이에요. 자녀를 키우며 쌓은 요리, 위생 관리, 스케줄 조율 능력을 이력서에 표현할 수 있어요. AI에게 "주부 경력을 이력서에 어떻게 표현하면 좋을까?"라고 물어보면 좋은 표현을 알려줄 거예요.
  </li>
  <li style="margin-top:10px;">
    <strong>Q. AI가 만든 이력서를 그냥 써도 되나요?</strong><br>
    A. 초안으로는 훌륭하지만, 반드시 내 정보와 일치하는지 확인하고, 어색한 표현은 내 말투로 자연스럽게 다듬어 주세요. 최종 결과물은 "내가 쓴 이력서"여야 해요.
  </li>
  <li style="margin-top:10px;">
    <strong>Q. AI 사용법을 잘 모르겠어요.</strong><br>
    A. 뤼튼(wrtn.ai)을 추천해요. 카카오톡 계정으로 가입하고, 채팅창에 위에 나온 예시를 복붙하면 돼요. 처음엔 어색해도 한 번만 써보면 금방 익숙해집니다.
  </li>
</ul>

<div class="post-tip">
  🎉 <strong>마지막으로 한 마디</strong><br>
  이력서는 "나를 소개하는 첫 인사"예요. 완벽하지 않아도 괜찮아요. 성실하고 책임감 있게 일하겠다는 마음이 담겨 있으면 충분합니다. AI의 도움을 받아 멋진 이력서 완성하시길 응원합니다! 💪
</div>
    `
  },

  {
    id: 'apply-parttime-2025',
    category: '지원 방법',
    categoryColor: '#15803D',
    title: '처음 알바 지원하시는 분께 — 단계별 완전정복',
    summary: '공고를 찾고, 전화하고, 면접 보는 전 과정을 쉽게 설명합니다. 처음이라 긴장되셔도 괜찮아요. 순서대로 따라하면 됩니다.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['알바지원', '면접', '취업방법'],
    content: `
<p>나이가 있으신 분들은 알바 지원 자체가 낯설게 느껴질 수 있어요. 어떻게 연락하고, 어떻게 준비해야 하는지 처음부터 끝까지 알려드릴게요.</p>

<h3>🔍 1단계: 공고 찾기</h3>
<p>동네로처럼 시니어 특화 취업 사이트를 활용하면 나이 제한 없는 공고를 쉽게 찾을 수 있어요.</p>
<ul>
  <li><strong>동네로</strong> — 지금 보고 계신 사이트 (시니어 전용)</li>
  <li><strong>알바천국</strong> — 중장년 채용관 별도 운영</li>
  <li><strong>고용24(work24.go.kr)</strong> — 정부 운영, 다양한 공고</li>
  <li><strong>지역 주민센터 게시판</strong> — 동네 파트타임이 많아요</li>
</ul>
<div class="post-tip">
  💡 "채용시 마감", "상시모집"이라고 적힌 공고는 당장 지원해도 됩니다.
</div>

<h3>📞 2단계: 전화 지원 (가장 빠른 방법)</h3>
<p>많은 소규모 업체는 온라인 지원보다 전화를 훨씬 좋아해요. 짧고 또렷하게 말하면 됩니다.</p>
<div class="post-example">
  <div class="post-example-label">전화 예시</div>
  "안녕하세요, 공고 보고 연락드렸어요. 파트타임 아직 구하고 계신가요? (네 → ) 혹시 언제 면접 볼 수 있을까요?"
</div>
<ul>
  <li>너무 많이 설명하지 않아도 돼요 — 일단 "자리가 있는지"만 먼저 물어보세요.</li>
  <li>전화가 어려우면 문자나 카카오톡으로 먼저 연락해도 됩니다.</li>
</ul>

<h3>📄 3단계: 이력서 준비</h3>
<ul>
  <li>A4 1장 분량, 간결하게</li>
  <li>최근 일한 경험 + 연락처 + 지원 동기 한 줄이면 충분</li>
  <li>편의점·마트·카페 등 소규모 자리는 이력서 없이 면접 보기도 해요</li>
</ul>

<h3>🙋 4단계: 면접 당일</h3>
<ul>
  <li><strong>시간 엄수</strong> — 약속 시간 10분 전 도착</li>
  <li><strong>복장</strong> — 깔끔하면 됩니다. 정장 필요 없어요</li>
  <li><strong>흔히 묻는 질문</strong>
    <ul>
      <li>"언제부터 일할 수 있나요?" — 구체적인 날짜로 답하세요</li>
      <li>"주 며칠 가능하세요?" — 솔직하게 답하되, 유연하게 말하면 유리해요</li>
      <li>"특별히 못 하시는 게 있나요?" — 솔직하게 말씀하세요</li>
    </ul>
  </li>
</ul>
<div class="post-tip">
  💡 <strong>나이 걱정 마세요</strong>: "책임감 있게 성실히 하겠다"는 한 마디가 젊은 지원자보다 훨씬 경쟁력 있을 수 있어요.
</div>

<h3>✅ 합격 후 챙길 것</h3>
<ul>
  <li>근로계약서 반드시 작성하고 한 부 받아두기 (거절하면 불법)</li>
  <li>최저임금 이상인지 확인 (2026년 기준 시급 10,030원)</li>
  <li>주 15시간 이상이면 주휴수당 포함 여부 확인</li>
</ul>
    `
  },

  {
    id: 'speech-modern-2025',
    category: '면접·소통',
    categoryColor: '#7C3AED',
    title: '면접에서 손해 보는 말투 — 이렇게 바꿔보세요',
    summary: '본인도 모르게 쓰는 "나이 들어 보이는" 말투들이 있어요. 약간만 바꿔도 훨씬 신뢰감 있고 세련된 인상을 줄 수 있습니다.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['면접', '말투', '소통', '인상관리'],
    content: `
<p>오랜만에 사회생활을 시작하면 말투나 표현 방식이 현재 직장 문화와 조금 다를 수 있어요. 작은 변화만으로도 훨씬 좋은 인상을 줄 수 있습니다.</p>

<h3>❌ 피하면 좋을 표현들</h3>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "나 같은 나이에 받아줄지…"</div>
    <div class="post-compare-after">✅ "성실하게 잘 할 수 있습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "젊은 친구들한테 배워야죠 뭐."</div>
    <div class="post-compare-after">✅ "빠르게 배우고 적응하겠습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "나이가 있어서 스마트폰은 좀…"</div>
    <div class="post-compare-after">✅ "배우는 데 시간이 좀 필요하지만 꼭 익히겠습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "뭐 월급이야 많이 안 바라죠."</div>
    <div class="post-compare-after">✅ "공고에 나온 조건으로 지원했습니다."</div>
  </div>
</div>

<div class="post-tip">
  💡 <strong>핵심</strong>: 스스로를 낮추는 표현은 역효과가 나요. 자신감 있게 말하는 것이 훨씬 좋은 인상을 줍니다.
</div>

<h3>📌 면접에서 플러스가 되는 표현</h3>
<ul>
  <li>"오랜 경험을 바탕으로 책임감 있게 하겠습니다."</li>
  <li>"지각이나 무단결근은 절대 하지 않습니다."</li>
  <li>"고객 응대 경험이 있어서 친절하게 잘 할 수 있습니다."</li>
  <li>"꼼꼼하고 실수를 잘 안 하는 편입니다."</li>
</ul>
<p>연령대가 높다는 것은 곧 <strong>성실함, 안정성, 풍부한 생활 경험</strong>을 의미해요. 이 점을 강점으로 표현하세요.</p>

<h3>📱 카카오톡·문자 예절</h3>
<p>요즘 면접 연락이나 업무 소통에 카카오톡을 많이 써요. 간단한 예절 몇 가지만 알아두면 좋아요.</p>
<ul>
  <li>인사는 짧게 — "안녕하세요, OOO입니다." 한 줄이면 충분</li>
  <li>이모티콘은 최소화 — 업무 관련 연락에서는 ❤️😊 같은 이모티콘 자제</li>
  <li>답장은 빠르게 — 반나절 이내가 좋아요</li>
  <li>긴 문장은 나눠서 — 한 번에 너무 길게 보내지 않기</li>
</ul>

<h3>🗣️ 자연스러운 말투 연습하는 법</h3>
<p>면접 전에 거울 앞에서 소리 내어 연습해보세요. 3~4번만 해도 실전에서 훨씬 자신감이 생깁니다.</p>
<div class="post-example">
  <div class="post-example-label">연습 문장</div>
  "저는 꼼꼼하고 성실한 편이라는 말을 자주 들었습니다. 일단 맡은 일은 끝까지 하는 스타일이에요. 잘 부탁드립니다."
</div>
    `
  }
];
