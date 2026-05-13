/* 동네로 정보게시판 게시물 데이터
 * 운영자가 직접 편집해서 게시물을 추가/수정합니다.
 * id는 고유한 영문 slug (댓글이 달리면 바꾸지 마세요)
 */
var POSTS_DATA = [
  {
    id: 'job-scam-2026',
    category: '주의사항',
    categoryColor: '#DC2626',
    title: '취업 사기, 이런 공고는 조심하세요 — 시니어를 노리는 5가지 수법',
    summary: '작년 한 해 동안 50대 이상 구직자가 취업 사기로 잃은 돈이 수십억 원이라는 거 아세요? 달콤한 말 뒤에 숨겨진 수법, 미리 알면 피할 수 있습니다.',
    date: '2026-05-11',
    author: '동네로 운영팀',
    tags: ['취업사기', '사기예방', '주의사항', '안전취업'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
경기도에 사시는 박영순 씨(61세)는 지난해 9월, 한 구인 공고를 보고 설레는 마음으로 전화를 걸었습니다.<br>
"나이 무관, 일 배울 수 있는 분 환영. 월 250~350만원."<br><br>
면접 자리에서 담당자는 이렇게 말했어요.<br>
<em>"저희 제품 교육을 먼저 이수하셔야 해요. 50만원인데, 합격하시면 바로 월급에서 돌려드립니다."</em><br><br>
박영순 씨는 50만원을 냈습니다. 그리고 교육이 끝난 뒤, 회사는 연락을 끊었습니다.
</p>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  ⚠️ 이런 일이 남의 이야기처럼 느껴지시나요? 당하신 분들 대부분이 "설마 나한테 이런 일이"라고 생각했다고 하십니다. 아래 5가지 수법, 꼭 기억해두세요.
</div>

<h3>🚨 수법 1 — "교육비만 내면 취업 보장"</h3>
<p>교육비, 등록비, 보증금, 유니폼비… 명목은 달라도 내용은 똑같습니다. <strong>정상적인 회사는 지원자에게 돈을 요구하지 않습니다.</strong> 단 한 푼도요.</p>
<p>특히 "나중에 돌려준다", "월급에서 빼준다"는 말로 안심시키는 경우가 많아요. 일단 돈이 나가면 되돌려받기가 거의 불가능합니다.</p>

<h3>🚨 수법 2 — 무슨 일인지 뚜렷하게 안 알려주는 공고</h3>
<p>"단순 사무 보조", "영업 및 판매 관련 업무", "재택 가능 부업"처럼 실제 업무가 불분명한 곳은 주의하세요. 면접 가서 들어보면 다단계 판매이거나, 지인에게 보험을 파는 일인 경우가 많습니다.</p>

<div class="post-example">
  <div class="post-example-label">✅ 면접 가기 전에 이렇게 확인하세요</div>
  전화나 이메일로 미리 물어보세요:<br>
  <strong>"구체적으로 어떤 업무를 담당하게 되나요? 하루 일과를 설명해 주실 수 있으세요?"</strong><br><br>
  명확하게 답을 못 하거나, "와서 보면 알아요"라고 하면 조심하세요.
</div>

<h3>🚨 수법 3 — 현실을 벗어난 고액 급여</h3>
<p>"주 3일, 하루 3시간 근무에 월 200만원"이라는 공고를 보면 솔깃하죠. 하지만 그 시간에 그 돈을 주는 정상적인 일자리는 없습니다.</p>
<p>간단히 계산해보면 금방 알 수 있어요. 주 3일 × 3시간 × 4주 = 월 36시간. 최저임금 시급(2026년 기준 10,030원)으로 계산하면 약 36만원이 적정 수준입니다. 200만원은 말이 안 되죠.</p>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  💡 비교 방법: 고용24(work24.go.kr)에서 같은 직종·시간대 공고를 검색해보세요. 유독 급여가 높은 공고는 의심하는 게 맞습니다.
</div>

<h3>🚨 수법 4 — 지원 단계부터 개인정보를 요구</h3>
<p>통장 사본, 신분증 앞뒷면, 가족관계증명서, 주민등록등본… 이런 서류를 입사 결정도 안 난 상태에서 요구하면 개인정보 도용을 의심하세요. 이 정보들로 휴대폰 개통, 대출 신청 같은 범죄에 이용됩니다.</p>
<p><strong>원칙: 입사 확정 전에는 신분증 사본 하나도 보내지 마세요.</strong></p>

<h3>🚨 수법 5 — "일단 며칠 해보시고요"</h3>
<p>계약서 없이 일을 시작하게 하는 경우입니다. 며칠 일하다 보면 "생각보다 잘 안 맞는다"며 임금을 안 주거나 깎으려 해요. 서류가 없으니 증거도 없습니다.</p>
<p>아무리 소규모 일이라도, 하루짜리 단기 아르바이트라도 근로계약서는 반드시 써야 합니다. 안 써주면 사업주가 법을 어기는 거예요.</p>

<h3>✅ 의심스러울 때 확인하는 3가지 방법</h3>
<ul>
  <li><strong>사업자등록 조회</strong> — 국세청 홈택스(hometax.go.kr) 접속 → 사업자등록번호 조회. 등록이 안 된 곳은 바로 포기하세요.</li>
  <li><strong>회사명 + 사기 검색</strong> — 네이버에 "회사명 사기", "회사명 후기"로 검색하면 피해 사례가 종종 나옵니다.</li>
  <li><strong>주변에 말하기</strong> — 가족이나 친구에게 "이런 곳에서 연락 왔는데 어떻게 생각해?" 하고 물어보는 것만으로도 큰 피해를 막을 수 있어요.</li>
</ul>

<div class="post-tip">
  🛡️ <strong>피해를 당하셨다면</strong><br>
  고용노동부 고객상담센터 ☎ 1350 (무료, 평일 09:00~18:00)<br>
  금품 피해 발생 시 경찰청 ☎ 112 또는 사이버범죄신고(ecrm.police.go.kr)<br><br>
  부끄러운 일이 아닙니다. 신고하셔야 다른 분들이 같은 피해를 안 입습니다.
</div>
    `
  },

  {
    id: 'labor-contract-2026',
    category: '근로 권리',
    categoryColor: '#0891B2',
    title: '근로계약서, 이것만 확인하면 됩니다 — 5가지 체크리스트',
    summary: '"믿고 일하면 되지"라고 생각했다가 3개월 뒤 억울한 일을 당하는 분들이 많습니다. 서명 전에 딱 5가지만 확인하세요. 5분이면 충분합니다.',
    date: '2026-05-09',
    author: '동네로 운영팀',
    tags: ['근로계약서', '근로권리', '임금', '주휴수당'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
인천에 사는 최정희 씨(56세)는 동네 마트에서 일을 시작할 때 사장님이 "우리 사이에 무슨 계약서냐"고 해서 그냥 구두로 약속만 했습니다.<br>
3개월 뒤, 월급이 처음 얘기보다 20만원 적었어요. "처음부터 이 금액이었잖아요"라는 말에 반박할 방법이 없었습니다.<br><br>
근로계약서는 귀찮아서 안 쓰는 게 아닙니다. <strong>나를 지키는 증거</strong>입니다.
</p>

<div class="post-tip">
  📌 <strong>근로계약서는 2부 작성, 1부는 반드시 내가 보관해야 합니다.</strong><br>
  사업주가 안 준다고 하면 그 자체로 법 위반입니다. "제 것 한 부 주세요"라고 당당히 요청하세요.
</div>

<h3>✅ 체크리스트 1 — 급여 (가장 중요)</h3>
<p>가장 먼저 볼 것은 <strong>내가 얼마를 받는가</strong>입니다.</p>
<ul>
  <li>시급 또는 월급이 숫자로 명확히 적혀있는지</li>
  <li>2026년 최저시급 <strong>10,030원</strong> 이상인지</li>
  <li>주휴수당이 포함인지 별도인지 표시되어 있는지</li>
</ul>

<div class="post-example">
  <div class="post-example-label">주휴수당이 뭔가요?</div>
  주 15시간 이상 일하면 일주일에 하루치 임금을 추가로 받을 권리가 법으로 보장됩니다.<br><br>
  예시: 시급 10,030원으로 주 5일(하루 4시간) 근무한다면<br>
  → 주급 200,600원 + 주휴수당 40,120원 = 실제 수령 240,720원<br><br>
  "주휴수당 포함"이라고 써있으면 이미 합산된 금액, "별도"면 추가로 받아야 합니다.
</div>

<h3>✅ 체크리스트 2 — 근무 시간과 요일</h3>
<ul>
  <li>출근 시간, 퇴근 시간이 정확히 적혀있는지</li>
  <li>어느 요일에 일하는지 명시되어 있는지</li>
  <li>식사 시간 등 휴게 시간이 포함되어 있는지</li>
</ul>

<div class="post-tip">
  💡 4시간 근무하면 30분, 8시간 근무하면 1시간 이상 휴게가 법적 권리입니다.<br>
  "쉬는 시간 없이 일해야 해요"라는 말은 법을 어기는 거예요.
</div>

<h3>✅ 체크리스트 3 — 계약 기간</h3>
<p>언제부터 언제까지인지 날짜가 적혀있어야 합니다. "기간 정함 없음"이라고 써있으면 정규직에 해당하는 무기계약입니다.</p>
<p>계약 만료일이 다가오면 사업주가 미리 알려줘야 해요. 아무 말 없이 갑자기 "다음 달부터 안 나오셔도 됩니다"는 법 위반 가능성이 있습니다.</p>

<h3>✅ 체크리스트 4 — 업무 내용</h3>
<p>계약서에 적힌 업무와 실제로 하게 되는 일이 다르면 문제가 생깁니다. "계산 업무"라고 써있는데 청소나 배달까지 시키는 경우가 종종 있어요.</p>
<p>구두로 들은 내용과 계약서 내용이 다르면, <strong>계약서 내용이 법적으로 유효합니다.</strong> 서명 전에 꼭 확인하세요.</p>

<h3>✅ 체크리스트 5 — 4대보험</h3>
<ul>
  <li>주 15시간 이상 근무 → 고용보험 + 산재보험 가입 의무</li>
  <li>월 60시간(주 15시간) 이상 → 건강보험 + 국민연금도 의무 가입</li>
</ul>

<div class="post-example">
  <div class="post-example-label">왜 4대보험이 중요한가요?</div>
  <strong>고용보험</strong>: 갑자기 일을 그만두게 됐을 때 실업급여를 받을 수 있어요.<br>
  <strong>산재보험</strong>: 일하다 다치면 치료비와 생활비를 지원받습니다. 사업주 부담이라 나한테 추가 비용 없어요.<br><br>
  사업주가 "보험 안 들어줄게요"라고 하면 불법입니다. 가입 의무가 있는 사업장이라면 직원 동의 없이 가입해줘야 합니다.
</div>

<h3>서명하기 전, 이 한 마디만 하세요</h3>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">❌ 그냥 서명</div>
    <div class="post-compare-after" style="color:#374151;">"네, 알겠어요." 하고 바로 서명 → 나중에 내용 기억 안 나서 억울한 상황 발생</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">✅ 이렇게 하세요</div>
    <div class="post-compare-after" style="color:#374151;"><strong>"잠깐 한 번 읽어봐도 될까요?"</strong> — 이 한 마디면 됩니다. 좋은 사업주라면 당연히 읽게 해줍니다.</div>
  </div>
</div>

<p>읽다가 모르는 내용이 있으면 그자리에서 물어보세요. 또는 <strong>고용노동부 ☎ 1350</strong>에 전화하면 무료로 상담해 줍니다. 전화 한 통이 몇 달치 임금을 지킬 수 있어요.</p>
    `
  },

  {
    id: 'senior-job-support-2026',
    category: '취업 준비',
    categoryColor: '#2563EB',
    title: '무료로 취업 도움받는 방법 — 고용센터·시니어클럽 이용 가이드',
    summary: '정부가 운영하는 무료 취업 서비스, 활용하는 분이 생각보다 훨씬 적습니다. 어디에 가면 되는지, 가서 뭘 도움받을 수 있는지, 처음 가는 분을 위해 상세히 정리했습니다.',
    date: '2026-05-07',
    author: '동네로 운영팀',
    tags: ['고용센터', '시니어클럽', '취업지원', '무료서비스'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
"혼자 이력서 써서 넣어봤는데 연락이 없어요. 어떻게 해야 하죠?"<br><br>
이런 분들이 가장 많이 하는 실수가 있어요. 혼자 끙끙대는 겁니다.<br>
우리 세금으로 운영하는 무료 취업 지원 서비스가 전국 곳곳에 있는데, 정작 그 서비스를 받아야 할 분들이 모르고 계세요.
</p>

<div class="post-tip">
  🎯 이 글에서 소개하는 서비스는 모두 <strong>무료</strong>입니다. 신청하거나 방문하는 것 자체가 국민의 권리입니다.
</div>

<h3>🏢 고용복지플러스센터 — 모든 연령, 모든 상황</h3>
<p>고용노동부가 직접 운영하는 곳으로, 취업 상담부터 실업급여 신청, 직업훈련 연계까지 다양한 서비스를 한 곳에서 받을 수 있습니다. 전국 100개 이상 운영 중이에요.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">받을 수 있는 도움</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • 1:1 취업 상담 (담당 직원이 내 상황에 맞게 방향 잡아줌)<br>
      • 이력서·자기소개서 첨삭 (직접 봐주고 수정해줌)<br>
      • 국비 직업훈련 연계 (내 돈 안 들이고 기술 배우는 교육 안내)<br>
      • 일자리 정보 제공 및 취업 알선<br>
      • 실업급여 신청 및 상담
    </div>
  </div>
</div>

<div class="post-example">
  <div class="post-example-label">처음 방문할 때 이렇게 하세요</div>
  <strong>전화 예약:</strong> 고용노동부 고객상담센터 ☎ 1350 (무료, 평일 09:00~18:00)<br>
  "가까운 고용복지플러스센터에서 취업 상담을 받고 싶은데 예약할 수 있을까요?"<br><br>
  <strong>또는 직접 방문:</strong> 예약 없이 가도 됩니다. 대기 시간이 있을 수 있어요.<br>
  고용24(work24.go.kr) → 상단 "기관 찾기" → "고용복지플러스센터" 검색
</div>

<div class="post-tip">
  ✅ <strong>가져갈 것:</strong> 신분증만 있으면 됩니다. 이력서가 없어도, 어떤 일을 해야 할지 몰라도 괜찮아요. 그걸 함께 정하는 게 상담이니까요.
</div>

<h3>👴 시니어클럽 — 만 60세 이상 전담</h3>
<p>만 60세 이상 어르신만을 위한 취업 전담 기관입니다. 전국에 약 400여 개소가 운영 중이에요. 고용센터보다 분위기가 훨씬 편안하고, 비슷한 연령대 분들과 함께 프로그램에 참여하는 경우도 많습니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">시니어클럽에서 받을 수 있는 것</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • 공공기관·사회서비스 일자리 직접 연결 (경쟁 없이 배정받는 경우 많음)<br>
      • 무료 직업훈련 (요양보호, 돌봄, 경비 관련 자격증 교육 등)<br>
      • 취업 후에도 적응 지원 — 일하다 어려운 점 생기면 상담 가능<br>
      • 비슷한 연령대 취업자들과 커뮤니티
    </div>
  </div>
</div>

<div class="post-example">
  <div class="post-example-label">찾는 방법</div>
  한국시니어클럽협회 seniorclub.or.kr → "시니어클럽 찾기"<br>
  또는 주민센터에 "가까운 시니어클럽이 어디 있나요?"라고 물어보면 안내해 줍니다.
</div>

<h3>🏛️ 중장년일자리희망센터 — 50~69세 전용</h3>
<p>50~69세 중장년층을 위한 전문 기관이에요. 단순한 취업 알선보다 <strong>내 경력 전체를 다시 설계</strong>하는 데 초점을 맞춥니다. 20~30년간 쌓은 경험을 어떻게 새 직장에 적용할지 함께 고민해 줍니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:6px;">이런 분께 특히 추천</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • 오래 일했던 분야에서 나와 새 출발을 준비 중인 분<br>
      • 어떤 일을 해야 할지 방향을 못 잡겠는 분<br>
      • 창업을 고민 중인 분<br>
      • 이력서 쓰기 막막한 분
    </div>
  </div>
</div>

<div class="post-example">
  <div class="post-example-label">찾는 방법</div>
  고용24(work24.go.kr) → 상단 "기관 찾기" → "중장년일자리희망센터" 검색
</div>

<div class="post-tip">
  💬 <strong>마지막으로</strong><br>
  처음 방문이 가장 어렵습니다. 문을 한 번 열고 들어가면, 담당자가 나머지를 도와줍니다.<br>
  "뭘 도움받아야 할지도 모르겠다"고 말해도 괜찮아요. 그 말 한마디에서 상담이 시작됩니다.
</div>
    `
  },

  {
    id: 'resume-ai-2025',
    category: '취업 준비',
    categoryColor: '#2563EB',
    title: 'AI로 이력서 쓰는 법 — 컴퓨터 서툴러도 30분이면 완성됩니다',
    summary: '"이력서를 어떻게 써야 하나" 막막하셨죠? 뤼튼이나 ChatGPT에 내 상황을 말하면 바로 초안을 만들어 줍니다. 처음부터 끝까지 실제 예시와 함께 알려드릴게요.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['이력서', 'AI', '취업준비', 'ChatGPT', '뤼튼'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
이력서를 쓰기 시작하면 하얀 화면 앞에서 멈추게 됩니다.<br>
"경력이 단순한데 뭘 쓰지", "한 줄도 못 쓰겠어", "오래 쉬었는데 공백기를 어떻게 설명하나"…<br><br>
그런데 요즘은 AI에게 말을 걸면 몇 분 안에 이력서 초안을 뚝딱 만들어 줍니다.<br>
직접 타이핑하거나 양식을 찾아 헤맬 필요가 없어요. 스마트폰으로도 됩니다.
</p>

<div class="post-tip">
  📌 이 글에서 배울 것:<br>
  ① 무료로 쓸 수 있는 AI 도구 (스마트폰으로 OK)<br>
  ② AI에게 정확히 어떻게 부탁하는지 (그대로 복붙 가능한 예시)<br>
  ③ 완성된 이력서를 출력하는 방법
</div>

<h3>🤖 어떤 AI를 써야 하나요?</h3>
<p>모두 무료이고, 카카오톡 계정으로 가입할 수 있어요. 셋 중 하나만 골라 시작하면 됩니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">① 뤼튼 (wrtn.ai) — 입문자에게 가장 추천</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.7;">
      카카오톡 계정으로 1분 만에 가입. 한국어에 특화되어 자연스러운 문장을 써줍니다.<br>
      앱 설치: 플레이스토어·앱스토어에서 "뤼튼" 검색
    </div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">② ChatGPT (chat.openai.com)</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.7;">
      구글 계정으로 가입. 세계에서 가장 많이 쓰는 AI입니다.<br>
      무료 버전으로도 이력서 작성에 충분합니다.
    </div>
  </div>
</div>

<h3>✏️ STEP 1 — 시작 전에 이것만 메모하세요 (5분)</h3>
<p>AI가 좋은 이력서를 써주려면 내 정보를 알아야 합니다. 종이에 대충 적어두기만 해도 돼요.</p>

<div class="post-example">
  <div class="post-example-label">✍️ 메모할 내용 (이 양식 그대로 써보세요)</div>
  나이·성별: 58세 여성<br>
  거주지: 서울 노원구<br><br>
  <strong>일한 경험:</strong><br>
  - ○○마트 계산원 4년 (고객 응대, 재고 정리)<br>
  - ○○어린이집 보조교사 5년 (아이들 식사·활동 보조)<br><br>
  <strong>자격증:</strong> 요양보호사 2급 (2020년)<br>
  <strong>지원하려는 곳:</strong> 편의점 파트타임<br>
  <strong>일 가능한 시간:</strong> 평일 오전 9시~오후 2시
</div>

<div class="post-tip">
  💡 <strong>경력이 없는 것 같다고 걱정 마세요.</strong><br>
  가사 경력, 자녀 양육, 봉사활동, 부모님 돌봄 경험도 훌륭한 경력입니다.<br>
  "20년간 3남매 키우며 살림한 경험"도 이력서에 쓸 수 있어요.
</div>

<h3>💬 STEP 2 — AI에게 이렇게 부탁하세요</h3>
<p>뤼튼이나 ChatGPT를 열고 아래 내용을 그대로 복사해서 붙여넣은 다음, 내 정보로 바꿔 쓰세요.</p>

<div class="post-example">
  <div class="post-example-label">📋 AI에게 보낼 문장 (이것만 복붙하세요)</div>
  나는 58세 여성입니다. 편의점 파트타임 지원용 이력서를 A4 1장으로 써주세요.<br><br>
  [나의 경험]<br>
  - ○○마트에서 4년 계산원 근무 (고객 응대, 재고 정리 담당)<br>
  - ○○어린이집 보조교사 5년 (아이들 식사·활동 보조)<br><br>
  [자격증] 요양보호사 2급<br>
  [성격] 성실하고 책임감이 강하며 지각을 해본 적이 없어요<br>
  [근무 희망] 평일 오전 9시~오후 2시<br><br>
  자기소개 한 단락도 포함해 주세요. 고객을 대하는 경험이 많다는 점을 강조해줘요.
</div>

<p>잠시 기다리면 이력서 초안이 나옵니다. 읽어보고 마음에 안 드는 부분은 바로 이렇게 말해보세요.</p>

<div class="post-example">
  <div class="post-example-label">🔧 수정 요청 예시</div>
  "자기소개 부분을 더 따뜻하고 친근한 느낌으로 바꿔줘요."<br>
  "너무 딱딱하게 느껴지는 부분을 자연스럽게 다듬어줘요."<br>
  "좀 더 짧게 줄여줘요. 군더더기 없이요."
</div>

<h3>🏆 STEP 3 — 지원하는 곳마다 살짝 맞춰보세요</h3>
<p>같은 이력서를 여러 곳에 내는 것보다, 지원하는 곳에 맞게 조금씩 바꾸면 연락 받을 확률이 높아집니다.</p>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">편의점·마트 지원</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"계산 업무 경험과 빠른 서비스를 강조해서 자기소개를 다시 써줘요."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">학교 급식실·구내식당</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"위생 관념, 꼼꼼함, 체력적으로 건강한 점을 강조해줘요."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">요양원·복지관</div>
    <div class="post-compare-after" style="color:#374151;background:#F8F5FF;">"요양보호사 자격증과 어르신을 돕는 경험, 따뜻한 성품을 앞에 배치해줘요."</div>
  </div>
</div>

<h3>👀 STEP 4 — 서명 전에 꼭 확인하세요</h3>
<p>AI가 잘 써줘도 내가 한 번은 꼼꼼히 읽어봐야 합니다. 가끔 없는 내용을 지어내는 경우가 있어요.</p>
<ul>
  <li>✅ 내 이름, 연락처가 정확한가</li>
  <li>✅ 일한 기간(년도)이 실제와 맞는가</li>
  <li>✅ 자격증 이름과 급수가 정확한가</li>
  <li>✅ 실제와 다른 내용은 없는가</li>
</ul>

<h3>🖨️ STEP 5 — 이력서 출력하기</h3>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:4px;">편의점 무인 출력기</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">GS25·CU·세븐일레븐에 있어요. AI 화면을 캡처해 사진으로 출력하거나, 파일로 저장해 USB로 가져가면 됩니다. 흑백 A4 한 장에 보통 100~150원.</div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:4px;">주민센터·도서관</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">동네 주민센터나 공공도서관에 무료 컴퓨터와 프린터가 있어요. 직원분께 도움 요청하면 친절히 도와줍니다.</div>
  </div>
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:4px;">이메일로 바로 제출</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.7;">요즘 많은 곳에서 이메일 지원도 받아요. AI에게 "이메일로 보낼 수 있는 깔끔한 형식으로 다시 정리해줘"라고 하면 됩니다.</div>
  </div>
</div>

<div class="post-tip">
  🎉 <strong>이력서는 완벽하지 않아도 됩니다.</strong><br>
  성실하게 일하겠다는 마음이 담겨 있으면 충분해요. AI의 도움을 받아 첫 발을 떼어보세요.
</div>
    `
  },

  {
    id: 'apply-parttime-2025',
    category: '지원 방법',
    categoryColor: '#15803D',
    title: '처음 알바 지원하시는 분께 — 전화부터 합격까지 단계별 안내',
    summary: '공고를 찾고, 전화하고, 면접 보고, 합격하는 전 과정을 실제 대화 예시와 함께 설명합니다. 처음이라 막막하셔도 괜찮아요.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['알바지원', '면접', '취업방법', '전화지원'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
공고를 보면서도 "나이가 있는데 연락해도 될까"라는 마음에 망설이시는 분들이 많아요.<br>
연락하지 않으면 100% 안 됩니다. 연락해야 확률이 생깁니다.<br><br>
처음 지원하는 과정이 낯설고 어색한 게 당연합니다. 이 글에서 전화 예시부터 면접 당일까지 하나하나 알려드릴게요.
</p>

<h3>🔍 1단계: 공고 찾을 때 이것만 확인하세요</h3>
<p>공고를 보다 보면 조건이 너무 많아서 복잡하게 느껴질 수 있어요. 사실 처음엔 딱 3가지만 봐도 됩니다.</p>
<ul>
  <li><strong>근무 위치</strong> — 집에서 대중교통으로 30분 이내면 적당해요. 너무 멀면 체력이 금방 지칩니다.</li>
  <li><strong>근무 시간</strong> — 내 생활 패턴과 맞는지. 아침형인지, 오후가 편한지.</li>
  <li><strong>"나이 무관" 또는 특별한 나이 제한이 없는 공고</strong> — 동네로, 알바천국 중장년 채용관, 고용24를 활용하면 이런 공고를 먼저 볼 수 있어요.</li>
</ul>

<div class="post-tip">
  💡 "채용시 마감", "상시모집"이라고 적힌 공고는 지금 당장 연락해도 됩니다. 공고가 올라간 지 오래됐어도 아직 구하고 있을 가능성이 높아요.
</div>

<h3>📞 2단계: 전화 한 통이 가장 빠릅니다</h3>
<p>소규모 업체, 동네 가게, 식당, 편의점 등은 이메일 지원보다 <strong>전화를 훨씬 좋아합니다.</strong> 인터넷으로 지원하면 며칠이 지나도 연락이 없는 경우가 많아요. 전화하면 그 자리에서 결정이 납니다.</p>
<p>긴장되시죠? 아래 예시 그대로 말씀하시면 됩니다.</p>

<div class="post-example">
  <div class="post-example-label">📞 전화 예시 — 이렇게만 말하면 됩니다</div>
  <strong>"안녕하세요, 공고 보고 연락드렸습니다. 혹시 아직 구하고 계신가요?"</strong><br><br>
  → 네, 아직 구해요: <strong>"혹시 언제 면접 볼 수 있을까요?"</strong><br>
  → 이미 구했어요: <strong>"아, 알겠습니다. 감사합니다."</strong> (깔끔하게 끊으면 됩니다)<br><br>
  전화 받는 분이 바쁘면 이렇게 말하세요:<br>
  <strong>"제가 나중에 다시 전화드려도 될까요? 언제가 좋으실까요?"</strong>
</div>

<div class="post-tip">
  💡 <strong>전화가 너무 긴장된다면?</strong><br>
  문자나 카카오톡으로 먼저 연락해도 됩니다.<br>
  "안녕하세요. 공고 보고 연락드립니다. 아직 구하고 계신지요? (성함) 드립니다."<br>
  이 정도면 충분합니다.
</div>

<h3>📄 3단계: 이력서는 이렇게 준비하세요</h3>
<p>편의점, 마트, 카페 같은 소규모 자리는 이력서 없이 그냥 면접 보는 곳도 많아요. 하지만 준비해 가면 훨씬 좋은 인상을 줍니다.</p>
<ul>
  <li>A4 한 장, 최근 일한 경험 + 연락처 + 지원 동기 한두 줄이면 충분</li>
  <li>사진은 최근 6개월 이내 것이 좋지만, 없으면 스마트폰으로 밝은 배경에 찍어도 OK</li>
  <li>AI(뤼튼, ChatGPT)로 30분이면 만들 수 있어요 — 이전 글 "AI로 이력서 쓰는 법" 참고</li>
</ul>

<h3>🙋 4단계: 면접 당일 — 이것만 기억하세요</h3>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:4px;">✅ 기본 준비</div>
    <div style="font-size:.85rem;color:#374151;line-height:1.8;">
      약속 시간 10분 전 도착. 정장 필요 없고 깔끔하면 됩니다.<br>
      이름·연락처 메모한 종이 한 장과 볼펜 챙기기.
    </div>
  </div>
</div>

<p>면접에서 자주 나오는 질문과 답변 방법:</p>

<div class="post-example">
  <div class="post-example-label">💬 자주 나오는 질문 + 답변 예시</div>
  <strong>"언제부터 일할 수 있으세요?"</strong><br>
  → "다음 주 월요일부터 바로 가능합니다." (구체적인 날짜가 좋아요)<br><br>
  <strong>"주 며칠, 몇 시간 가능하세요?"</strong><br>
  → "주 5일 오전 9시~오후 2시 희망하고 있어요. 필요하시면 조금 유동적으로 조정도 가능합니다."<br><br>
  <strong>"특별히 못 하는 게 있으세요?"</strong><br>
  → 솔직하게 말씀하세요. 무거운 걸 못 든다, 서있기 오래 힘들다 — 미리 말하는 게 나중에 트러블 없이 좋습니다.<br><br>
  <strong>"왜 지원하셨어요?"</strong><br>
  → "집에서 가까워서 오래 다닐 수 있을 것 같고, 이전에도 비슷한 일을 해봤는데 잘 맞았어요."
</div>

<div class="post-tip">
  💪 <strong>나이 걱정, 이렇게 생각하세요</strong><br>
  "젊은 사람들이랑 경쟁이 되겠어?" 하는 마음이 드실 수 있어요.<br>
  하지만 많은 사업주들이 <strong>성실함과 책임감</strong>을 더 중요하게 봅니다.<br>
  "지각 안 한다, 시킨 일은 끝까지 한다, 불평 없이 일한다" — 이게 어린 직원들보다 훨씬 경쟁력 있는 강점입니다.
</div>

<h3>✅ 합격 후 꼭 챙길 것</h3>
<ul>
  <li><strong>근로계약서</strong> 반드시 작성, 한 부는 내가 보관 (안 주면 사업주가 법 위반)</li>
  <li>2026년 최저시급 <strong>10,030원</strong> 이상인지 확인</li>
  <li>주 15시간 이상이면 주휴수당 포함 여부 확인</li>
  <li>첫날, 어떤 일을 어떻게 해야 하는지 <strong>모르면 꼭 물어보세요.</strong> 물어보는 게 더 낫습니다.</li>
</ul>

<div class="post-tip">
  🌟 첫 번째가 가장 어렵습니다. 전화 한 통만 해도 이미 한 발짝 앞으로 나온 거예요.
</div>
    `
  },

  {
    id: 'speech-modern-2025',
    category: '면접·소통',
    categoryColor: '#7C3AED',
    title: '면접에서 손해 보는 말투 — 작은 변화로 인상이 달라집니다',
    summary: '본인도 모르게 스스로를 낮추는 말투를 쓰고 있지는 않으신가요? 조금만 바꿔도 자신감 있고 신뢰감 있는 인상을 줄 수 있습니다.',
    date: '2026-05-03',
    author: '동네로 운영팀',
    tags: ['면접', '말투', '소통', '인상관리'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
면접을 마치고 나온 분들이 가장 많이 하는 후회가 있어요.<br>
"왜 내가 거기서 그런 말을 했을까…"<br><br>
취업을 오래 쉬셨거나, 면접이 처음이신 분들은 자기도 모르게 스스로를 낮추는 말투를 쓰는 경우가 많아요. 사실 그 말이 면접관에게는 "이 분은 자신감이 없는 분"으로 들립니다.
</p>

<h3>❌ 이런 말, 하지 마세요</h3>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "나 같은 나이에 받아주실지…"</div>
    <div class="post-compare-after">✅ "성실하고 책임감 있게 일하겠습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "젊은 친구들한테 많이 배워야죠 뭐."</div>
    <div class="post-compare-after">✅ "새로운 것도 빠르게 배우겠습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "나이가 있어서 스마트폰은 좀…"</div>
    <div class="post-compare-after">✅ "배우는 데 시간이 조금 필요하지만 꼭 익히겠습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "뭐 월급이야 많이 안 바라죠."</div>
    <div class="post-compare-after">✅ "공고에 나온 조건으로 지원드렸습니다."</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">❌ "이런 일을 잘 할 수 있을지 모르겠어요."</div>
    <div class="post-compare-after">✅ "처음엔 배우는 기간이 있겠지만 금방 적응할 자신 있습니다."</div>
  </div>
</div>

<div class="post-tip">
  💡 <strong>핵심:</strong> 스스로를 낮추는 말은 역효과입니다. 면접관이 원하는 건 자신감과 성실함입니다.
</div>

<h3>✅ 이런 말은 면접에서 플러스가 됩니다</h3>

<div class="post-example">
  <div class="post-example-label">💬 자신감 있는 표현들</div>
  "오랜 경험을 바탕으로 책임감 있게 하겠습니다."<br><br>
  "지각이나 무단결근은 제 삶에 없는 일입니다."<br><br>
  "고객을 대하는 일을 오래 해봐서 친절하게 잘 할 수 있습니다."<br><br>
  "꼼꼼하다는 말을 자주 듣는 편이에요. 실수를 잘 안 합니다."<br><br>
  "일단 맡은 일은 끝까지 하는 스타일입니다."
</div>

<p>나이가 있다는 것은 <strong>성실함, 안정성, 풍부한 생활 경험</strong>을 의미합니다. 이걸 약점으로 생각하지 마세요. 오히려 강점입니다.</p>

<h3>📱 카카오톡·문자 소통 예절</h3>
<p>요즘은 면접 일정 연락이나 합격 여부 통보도 카카오톡으로 오는 경우가 많아요. 간단한 예절 몇 가지만 알아두면 좋습니다.</p>

<div class="post-compare">
  <div class="post-compare-row">
    <div class="post-compare-before">❌ 이런 식은 피하세요</div>
    <div class="post-compare-after" style="color:#374151;">안녕하세요~~~ 면접 봤던 ○○○인데요~~ 언제 연락 오나요??ㅎㅎ</div>
  </div>
  <div class="post-compare-row">
    <div class="post-compare-before">✅ 이렇게 하세요</div>
    <div class="post-compare-after" style="color:#374151;">안녕하세요. ○○○ 날 면접 봤던 ○○○입니다. 결과를 여쭤봐도 될까요?</div>
  </div>
</div>

<ul>
  <li><strong>인사는 짧고 명확하게</strong> — "안녕하세요, ○○○입니다." 한 줄이면 충분합니다.</li>
  <li><strong>이모티콘은 자제</strong> — 업무 관련 연락에서는 ❤️😊 같은 이모티콘보다 텍스트가 더 신뢰감을 줍니다.</li>
  <li><strong>답장은 빠르게</strong> — 반나절 이내, 늦어도 당일 안에 답하세요.</li>
  <li><strong>용건은 한 번에</strong> — 문자를 3~4개 나눠서 보내는 것보다 한 번에 정리해서 보내세요.</li>
</ul>

<h3>🗣️ 면접 전 연습하는 가장 좋은 방법</h3>
<p>면접 전날, 아래 두 가지만 해보세요. 실제 면접에서 훨씬 자연스러워집니다.</p>

<div class="post-example">
  <div class="post-example-label">📝 연습 방법</div>
  <strong>1. 소리 내어 3번 읽기</strong><br>
  아래 문장을 거울 앞에서 소리 내어 3번 읽어보세요.<br>
  <em>"저는 꼼꼼하고 성실한 편이라는 말을 자주 들었습니다. 일단 맡은 일은 끝까지 하는 스타일이에요. 잘 부탁드립니다."</em><br><br>
  <strong>2. 가족이나 친구에게 말해보기</strong><br>
  "내가 면접 보러 가는데 이렇게 말하면 어때?" 하고 연습 상대 한 명만 있으면 됩니다. 피드백을 들으면 더 좋아요.
</div>

<div class="post-tip">
  🌟 자신감은 타고나는 게 아닙니다. 연습하면 생깁니다. 3번만 소리 내어 읽어도 달라집니다.
</div>
    `
  }
];
