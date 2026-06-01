/* 동네로 정보게시판 게시물 데이터
 * 운영자가 직접 편집해서 게시물을 추가/수정합니다.
 * id는 고유한 영문 slug (댓글이 달리면 바꾸지 마세요)
 */
var POSTS_DATA = [
  {
    id: 'babysitter-senior-2026',
    category: '취업가이드',
    categoryColor: '#0891B2',
    title: '아이 돌봄 시터, 50대도 됩니다 — 시급 평균 2만4천원, 지금 공고 2천 건 있습니다',
    summary: '아이 키운 경험이 있다면 충분합니다. 자격증 없어도 되고, 나이 제한도 없어요. 실제 공고 1,990건을 분석했더니 시급 평균이 2만4천원이었습니다.',
    date: '2026-06-01',
    author: '동네로 편집부',
    tags: ['베이비시터알바', '돌봄알바', '50대알바', '시니어단기알바', '맘시터'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
인천에 사시는 최순희 씨(57세)는 막내가 초등학교 들어가고 나서 10년 가까이 집에만 있었어요.<br>
재취업을 생각할 때마다 "이력서에 쓸 게 없다"며 포기했습니다.<br>
그러다 동네 맘 카페에서 "아이 봐줄 분 구해요"라는 글을 보고 연락했더니,<br>
엄마가 직접 이렇게 말했어요.<br><br>
<em>"아이 키워보신 분이면 딱이에요. 자격증 같은 건 없어도 괜찮아요."</em><br><br>
최순희 씨는 지금 일주일에 사흘, 오후 2시부터 7시까지 초등학생 하원 돌봄을 하며 한 달에 80만 원 넘게 법니다.
</p>

<div class="post-tip">
  💡 <strong>돌봄 시터는 '육아 경험'이 곧 스펙입니다.</strong> 아이를 낳고 키운 경험, 조카나 손자를 돌본 경험이 있다면 지원 자격이 충분합니다.
</div>

<h3>지금 공고가 얼마나 있나요?</h3>
<p style="line-height:1.9;color:#374151;">
동네로에서 오늘(2026년 6월 1일 기준) 수집한 베이비시터·돌봄 공고는 <strong>총 1,990건</strong>입니다.<br>
정기 돌봄이 1,819건, 단기(하루~며칠) 돌봄이 171건입니다.<br><br>
지역별로는 서울 773건, 경기 650건, 인천 95건 순이었습니다.<br>
수도권에만 1,500건이 넘어요.
</p>

<div class="post-example">
  <div class="post-example-label">📊 실제 공고 분석 결과</div>
  <strong>시급 범위:</strong> 13,000원 ~ 28,000원<br>
  <strong>시급 평균:</strong> 24,200원<br>
  <strong>시급 중간값:</strong> 26,000원<br>
  <strong>정기 돌봄 비율:</strong> 91% (단기는 9%)<br><br>
  최저임금(2026년 기준 10,030원)의 <strong>2.4배</strong>입니다.
</div>

<h3>왜 시급이 높을까요?</h3>
<p style="line-height:1.9;color:#374151;">
아이 돌봄은 부모가 "신뢰할 수 있는 사람"을 찾는 일이라 단순 노동보다 더 높은 금액을 지불합니다.<br>
여기에 몇 가지 이유가 더 있어요.
</p>
<ul style="line-height:2;color:#374151;">
  <li>자격증이 따로 필요 없어 구직자 경쟁이 줄어드는 분야</li>
  <li>부모가 아이의 안전을 위해 비용보다 신뢰를 먼저 따짐</li>
  <li>경험 있는 50~60대 시터를 선호하는 가정이 실제로 많음</li>
</ul>

<h3>어떤 일을 하나요?</h3>
<p style="line-height:1.9;color:#374151;">
공고 유형을 보면 크게 세 가지입니다.
</p>

<div class="post-example">
  <div class="post-example-label">유형 ① 하원 돌봄 (가장 흔함)</div>
  학교나 어린이집에서 아이를 데려와 부모가 퇴근할 때까지 봐주는 일입니다.<br>
  오후 2~4시 사이에 시작해서 저녁 7~8시에 끝나는 경우가 많아요.<br>
  <strong>예시 급여:</strong> 시급 23,000~26,000원 / 주 3~5일
</div>

<div class="post-example">
  <div class="post-example-label">유형 ② 종일 돌봄 (영아·유아)</div>
  부모가 출근하는 동안 종일 아이를 돌봅니다. 신생아나 24개월 미만 영아 공고가 많습니다.<br>
  체력이 더 필요하지만 급여도 그만큼 높아요.<br>
  <strong>예시 급여:</strong> 월 130만~180만 원 / 주 5일 풀타임
</div>

<div class="post-example">
  <div class="post-example-label">유형 ③ 단기 돌봄 (1~수일)</div>
  부모가 출장이나 병원 진료 등 일이 있을 때 임시로 맡기는 형태입니다.<br>
  일정이 불규칙하지만 시급이 더 높은 편이에요.<br>
  <strong>예시 급여:</strong> 시급 25,000~28,000원
</div>

<h3>나이 제한이 있나요?</h3>
<p style="line-height:1.9;color:#374151;">
맘시터 앱 기준으로 시터 프로필에 <strong>나이 제한이 없습니다.</strong><br>
오히려 "아이를 키워본 분", "경험 있는 분"을 명시적으로 선호하는 공고가 많아요.<br><br>
실제로 맘시터에서 활동하는 시터의 상당수가 40~60대입니다.<br>
"애를 기른 분이니까 믿을 수 있어요"라는 말을 부모들이 자주 합니다.
</p>

<div class="post-tip">
  💡 <strong>50~60대 시터가 오히려 유리한 이유:</strong> 젊은 시터는 이직·결혼 등으로 오래 못 한다고 부모가 불안해합니다. 중장년 시터는 "꾸준히 할 것"이라는 믿음을 주기 때문에 계약으로 이어지는 경우가 많아요.
</div>

<h3>지원 방법 — 맘시터 앱 가입부터</h3>
<p style="line-height:1.9;color:#374151;">
돌봄 시터 공고는 주로 <strong>맘시터 앱</strong>에 올라옵니다. 가입 방법은 어렵지 않아요.
</p>

<ul style="line-height:2.2;color:#374151;">
  <li>① 스마트폰에서 '맘시터' 검색 후 앱 설치</li>
  <li>② 회원가입 시 '시터'로 선택 (구직자 역할)</li>
  <li>③ 프로필 작성: 사진, 자기소개, 가능 시간, 경험 입력</li>
  <li>④ 근처 공고를 찾아 지원하거나, 공고 부모가 먼저 연락하기도 함</li>
</ul>

<div class="post-example">
  <div class="post-example-label">프로필 작성 팁 — 이렇게 쓰면 연락이 옵니다</div>
  <strong>❌ 이렇게 쓰면 안 됩니다:</strong><br>
  "아이를 좋아합니다. 열심히 하겠습니다."<br><br>
  <strong>✅ 이렇게 쓰면 눈에 띕니다:</strong><br>
  "자녀 2명을 직접 키웠고, 현재 초등학생 조카를 주말에 봐주고 있습니다. 아이 눈높이에 맞춰 이야기 잘 들어주는 편이고, 간단한 간식 챙기기·숙제 봐주기 모두 가능합니다. 비흡연자이며 건강보험 가입 상태입니다."
</div>

<h3>지원 전 확인할 것들</h3>
<ul style="line-height:2.2;color:#374151;">
  <li>✅ <strong>시급·시간 명확히 확인</strong> — 시작·종료 시간, 주 몇 회인지</li>
  <li>✅ <strong>아이 나이·인원</strong> — 영아와 초등학생은 체력 소모가 다름</li>
  <li>✅ <strong>집안일 포함 여부</strong> — 가사 도우미 역할까지 요구하는 경우 있음, 급여 다시 협의</li>
  <li>✅ <strong>교통 거리</strong> — 이동 시간도 내 시간임을 감안</li>
  <li>✅ <strong>계약서 작성</strong> — 구두 약속만 하면 나중에 분쟁 생길 수 있음</li>
</ul>

<div class="post-tip">
  ⚠️ <strong>주의:</strong> "가사 도우미 겸 시터"처럼 두 역할을 하나의 시급으로 요구하는 경우가 있습니다. 아이 돌봄과 청소·빨래는 별개 일이니, 처음 조건 협의 때 명확히 정리해두세요.
</div>

<h3>동네로에서 공고 찾는 법</h3>
<p style="line-height:1.9;color:#374151;">
동네로 앱에서 지역을 설정하면 <strong>내 동네 돌봄 공고</strong>를 바로 볼 수 있습니다.<br>
출처 필터에서 '맘시터'를 선택하면 베이비시터·돌봄 공고만 모아볼 수 있어요.<br>
공고를 클릭하면 맘시터 앱으로 연결돼 바로 지원할 수 있습니다.
</p>

<p style="font-size:1.05rem;line-height:1.9;color:#374151;margin-top:2rem;">
"내가 할 수 있는 게 뭐가 있겠어"라고 생각하셨다면, 한번 떠올려보세요.<br>
아이 키우면서 몸으로 익힌 것들 — 밥 챙기기, 숙제 봐주기, 아프면 어떻게 해야 하는지 — 그게 지금 2만4천원짜리 경험입니다.
</p>
`
  },
  {
    id: 'friendly-industry-2026',
    category: '취업전략',
    categoryColor: '#7C3AED',
    title: '50대를 반기는 업종이 따로 있습니다 — 현장에서 확인된 시니어 친화 직종 7가지',
    summary: '"나이 때문에 떨어졌나"라고 생각하신 적 있으세요? 업종 선택만 바꿔도 채용 확률이 크게 달라집니다. 현장에서 50대를 실제로 선호하는 이유가 있어요.',
    date: '2026-05-30',
    author: '동네로 운영팀',
    tags: ['50대취업', '시니어채용', '중장년일자리', '업종선택', '60대재취업'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
경기도 수원에 사시는 박영철 씨(58세)는 작년 한 해 동안 이력서를 27번 냈습니다.<br>
IT 회사, 스타트업, 물류센터까지 두루 도전했는데 번번이 탈락이었어요.<br>
그러다 지인 소개로 동네 의약품 도매상에 서류를 냈더니 이틀 만에 면접 연락이 왔습니다.<br>
면접장에 갔더니 팀장이 이렇게 말했어요.<br><br>
<em>"우리 쪽은 젊은 친구들이 오래 못 있어요. 거래처 사장님들이 경험 많은 분을 더 좋아하거든요."</em><br><br>
박영철 씨는 지금 그 회사에서 2년째 일하고 있습니다.
</p>

<div class="post-tip">
  💡 <strong>핵심은 '어느 업종에 지원하느냐'입니다.</strong> 모든 곳이 나이를 꺼리는 게 아니에요. 오히려 경험 많은 중장년을 선호하는 업종이 분명히 존재합니다.
</div>

<h3>① 의약품·의료기기 영업·납품</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  병원장, 약국장, 원무과장과 거래하는 자리입니다. 상대방이 40~60대인 경우가 많아서 비슷한 연령대의 영업사원을 더 편하게 받아들여요. "신뢰감"과 "연륜"이 실제 영업력이 되는 분야입니다.<br><br>
  <strong>직종 예시:</strong> 의약품 배송·납품, 의료소모품 영업보조, 병원 납품기사<br>
  <strong>급여 범위:</strong> 월 220~280만 원 / 정규직 또는 계약직
</div>

<h3>② 건물·시설 관리 (경비·미화·설비)</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  이직률이 낮고 책임감 있는 분이 필요한 자리입니다. 아파트 경비, 빌딩 청소, 시설 설비 점검은 20~30대가 기피하는 반면 50~60대 지원자가 많아 "서로 맞는" 시장이 형성되어 있어요.<br><br>
  <strong>직종 예시:</strong> 아파트 경비원, 빌딩 미화원, 주차관리, 기계실 설비보조<br>
  <strong>급여 범위:</strong> 월 200~240만 원 / 대부분 정규직
</div>

<h3>③ 학교·복지관·공공기관 급식</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  집에서 밥 해본 경험이 오히려 강점입니다. 실제로 학교 급식 조리원 채용 공고를 보면 "조리 경력 보다 성실성 우선"이라는 표현이 자주 나와요. 위생 교육만 받으면 바로 투입이 가능하고, 오래 일해 줄 분을 원합니다.<br><br>
  <strong>직종 예시:</strong> 조리원, 배식보조, 영양보조, 급식실 위생관리<br>
  <strong>급여 범위:</strong> 시급 1만~1만2천 원 / 방학 중 휴무
</div>

<h3>④ 마트·소매점 계산원·매장관리</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  동네 슈퍼, 중형 마트, 반찬가게의 주요 고객층이 50~70대입니다. 같은 나이대의 직원이 있으면 고객도 편하게 말을 걸고 재방문율이 높아져요. 점주 입장에서 실질적인 매출 효과가 있습니다.<br><br>
  <strong>직종 예시:</strong> 계산원, 매장 진열, 재고 관리, 고객응대<br>
  <strong>급여 범위:</strong> 시급 최저~1만1천 원 / 주 3~5일 선택 가능
</div>

<h3>⑤ 주차 관리·안내원</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  장시간 서 있거나 뛰어다닐 필요 없이 한 자리를 지키는 역할입니다. 판단력과 책임감이 필요한 자리라 경험 많은 분을 선호해요. 대형병원, 쇼핑몰, 관공서 주변 주차장에 수요가 많습니다.<br><br>
  <strong>직종 예시:</strong> 주차안내원, 주차정산, 입출차 통제<br>
  <strong>급여 범위:</strong> 월 210~250만 원 / 교대근무
</div>

<h3>⑥ 어린이집·복지관 보조 교사</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  손자·손녀 돌봐본 경험이 실제 자격 요건처럼 인정받습니다. 정교사(보육교사 자격증 필요)가 아닌 "보조교사" 또는 "도우미" 포지션은 자격증 없이도 지원 가능한 경우가 많아요.<br><br>
  <strong>직종 예시:</strong> 놀이 보조, 급식 보조, 방과후 돌봄 보조<br>
  <strong>급여 범위:</strong> 시급 1만~1만2천 원 / 주 20~30시간
</div>

<h3>⑦ 요양보호사·재가돌봄</h3>
<div class="post-example">
  <div class="post-example-label">왜 50대를 선호하나요?</div>
  돌봄을 받는 어르신이나 가족이 "나이 많은 분이 더 안심된다"고 느끼는 경우가 많습니다. 자격증(요양보호사)이 있으면 공식 취업 채널로 바로 연결되고, 없어도 가정방문 도우미 형태로 시작할 수 있어요.<br><br>
  <strong>직종 예시:</strong> 방문요양보호사, 재가간병, 노인복지관 생활지도원<br>
  <strong>급여 범위:</strong> 시급 1만2천~1만4천 원 / 근무시간 유연
</div>

<div class="post-tip" style="background:#F0FDF4;border-color:#BBF7D0;">
  ✅ <strong>이렇게 활용해보세요</strong><br>
  동네로 공고 목록에서 위 업종 키워드로 검색해 보세요. "경비", "조리원", "요양", "납품", "주차", "돌봄" — 이 단어들이 들어간 공고는 50대 지원자를 실제로 반기는 경우가 많습니다. 나이 때문에 떨어졌다고 느끼신다면, 지원 업종을 먼저 바꿔보는 것이 가장 빠른 해결책입니다.
</div>
    `
  },
  {
    id: 'senior-reemployment-reality-2026',
    category: '취업전략',
    categoryColor: '#7C3AED',
    title: '50대 재취업, 솔직한 현실과 실제로 통한 방법 3가지',
    summary: '"열심히 내도 왜 안 될까?" 숫자로 보는 중장년 재취업 현황과, 실제로 자리를 잡은 분들이 공통적으로 한 것들을 정리했습니다.',
    date: '2026-05-30',
    author: '동네로 운영팀',
    tags: ['50대재취업', '중장년취업', '재취업통계', '60대취업', '시니어일자리'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
인천 남동구에 사시는 최미선 씨(56세)는 회계팀에서 20년 넘게 일하다 구조조정으로 나왔습니다.<br>
처음엔 "나 정도 경력이면 금방 구하겠지" 싶었는데, 서류만 넣다 7개월이 지나버렸어요.<br>
어느 날 고용센터 상담사가 이렇게 물었습니다.<br><br>
<em>"지금까지 어떤 회사에 넣어보셨어요?"</em><br><br>
최미선 씨의 목록을 본 상담사가 조용히 말했습니다.<br>
"이쪽 업종은 40대 초반을 선호하는 곳들이에요. 전략을 바꿔볼게요."<br><br>
그로부터 3개월 후, 최미선 씨는 지역 신협에서 경리 담당으로 일하기 시작했습니다.
</p>

<h3>📊 숫자로 보는 현실</h3>

<div class="post-example">
  <div class="post-example-label">중장년 재취업 현황 (고용노동부·통계청 자료)</div>
  <strong>평균 재취업 소요 기간:</strong> 5~8개월<br>
  (이전 직장보다 빠른 경우는 드묾. 준비 기간으로 생각하는 것이 현실적입니다)<br><br>
  <strong>첫 직장과 같은 분야로 재취업:</strong> 약 40%<br>
  나머지 60%는 업종·직종·근무형태 중 하나 이상을 바꿔 취업합니다<br><br>
  <strong>재취업 후 만족도 "생각보다 좋다":</strong> 약 65%<br>
  월급은 줄었어도 스트레스가 줄거나 자유시간이 늘어 오히려 삶의 질이 올라간다는 응답이 많아요
</div>

<div class="post-tip" style="background:#FEF3C7;border-color:#FDE68A;">
  ⚠️ <strong>가장 많이 하는 실수: "예전 연봉 기준으로 지원한다"</strong><br>
  재취업 초기에 이전 직장과 같은 조건을 요구하면 서류에서 탈락합니다. 처음 6개월~1년은 "발판을 마련하는 시기"로 보고, 조건보다 입사 가능성을 우선하는 것이 실제로 더 빠른 길입니다.
</div>

<h3>실제로 통한 방법 ①: 규모를 낮춘다</h3>

<div class="post-example">
  <div class="post-example-label">실제 사례 — 충남 천안 한점수 씨(61세)</div>
  대기업 물류팀 과장 출신. 중형 물류회사만 지원했다가 계속 탈락.<br>
  컨설턴트 조언대로 직원 20명 미만의 소형 물류업체로 방향을 바꿨더니<br>
  첫 달에 합격 연락이 왔습니다. 소형 업체일수록 경험 많은 사람을 더 반깁니다.<br>
  규모가 작아도 일은 있고, 나이 제한에서 자유롭습니다.
</div>

<h3>실제로 통한 방법 ②: 지인·커뮤니티를 통해 들어간다</h3>

<div class="post-example">
  <div class="post-example-label">실제 사례 — 경기 안산 김복자 씨(54세)</div>
  공개채용으로 6개월 동안 40군데 넣었다가 전부 탈락.<br>
  교회 지인이 "우리 건물 관리 아주머니 자리 생겼는데..." 라고 연락해 줬어요.<br>
  지원자가 많은 공개채용보다 소개·지인 채널이 실제 합격률이 훨씬 높습니다.<br>
  동창회, 종교 모임, 복지관 프로그램에서 자연스럽게 정보를 나눠보세요.
</div>

<h3>실제로 통한 방법 ③: 자격증 하나를 먼저 딴다</h3>

<div class="post-example">
  <div class="post-example-label">실제 사례 — 서울 은평 이영숙 씨(59세)</div>
  이력서를 아무리 내도 경력이 너무 오래됐다는 말을 들었어요.<br>
  6개월간 요양보호사 자격증을 취득했더니, 그 이후로는 서류 탈락이 없어졌습니다.<br>
  자격증이 "현재 일할 준비가 된 사람"이라는 신호를 보내주기 때문이에요.<br><br>
  <strong>50대에 빠르게 취득 가능한 자격증:</strong> 요양보호사, 지게차 운전기능사, 조경기능사, 사회복지사 2급, 한식조리기능사
</div>

<div class="post-tip" style="background:#F0FDF4;border-color:#BBF7D0;">
  ✅ <strong>지금 당장 할 수 있는 한 가지</strong><br>
  거주지 관할 고용복지플러스센터에 방문해 "중장년 취업 상담"을 신청하세요. 무료이고, 담당 상담사가 이력서 검토부터 지원 전략 수정까지 1:1로 도와줍니다. 혼자 고민하는 것보다 훨씬 빠릅니다.
</div>
    `
  },
  {
    id: 'restart-after-crisis-2026',
    category: '생활정보',
    categoryColor: '#059669',
    title: '전세사기·폐업 후 다시 일어서는 법 — 처음부터 다시 시작하는 50대를 위한 실전 안내',
    summary: '갑자기 주거나 생계가 불안해졌을 때, 취업만이 아니라 지원금·공공 일자리까지 한 번에 파악하는 방법을 알려드립니다.',
    date: '2026-05-30',
    author: '동네로 운영팀',
    tags: ['전세사기', '폐업후재취업', '50대재기', '긴급복지', '중장년지원'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
경기도 수원에 사시던 정명순 씨(57세)는 3년 전 전세집에서 보증금 1억 2천만 원을 날렸습니다.<br>
집주인이 세금 체납으로 경매에 넘어가면서 한 순간에 길거리에 나앉게 된 거예요.<br>
거기에 남편이 운영하던 가게마저 코로나 이후 결국 폐업했습니다.<br><br>
정명순 씨가 찾아온 곳은 주민센터였습니다.<br>
"저 지금 아무것도 없는데 뭐가 되나요?"<br><br>
주민센터 담당자는 생각보다 많은 방법이 있다고 알려줬습니다.
</p>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  ⚠️ <strong>이 글을 읽으셔야 하는 분</strong><br>
  • 전세사기 피해로 보증금을 잃으신 분<br>
  • 자영업·가게 폐업 후 소득이 없어진 분<br>
  • 갑자기 직장을 잃고 생활비가 막막한 50~60대<br>
  위기 상황에서 먼저 연결할 수 있는 제도들을 단계별로 정리했습니다.
</div>

<h3>📋 1단계: 긴급 생계 지원부터 확인하세요</h3>

<div class="post-example">
  <div class="post-example-label">긴급복지지원제도 (주민센터 방문)</div>
  <strong>대상:</strong> 위기 상황(주거·생계·의료 위기)에 처한 가구<br>
  <strong>지원 내용:</strong> 생계비(4인 가구 기준 월 162만 원 내외), 의료비, 주거비 지원<br>
  <strong>신청 방법:</strong> 주민센터 방문 또는 전화 129(복지 상담 전화)<br>
  <strong>처리 기간:</strong> 신청 당일~3일 이내 지급 가능<br><br>
  전세사기 피해자라면 "전세사기 피해자 지원" 제도도 별도로 있으니 반드시 함께 확인하세요.
</div>

<h3>📋 2단계: 실업급여 또는 폐업지원 신청</h3>

<div class="post-example">
  <div class="post-example-label">직장 퇴직 → 실업급여</div>
  퇴직 후 12개월 이내, 고용보험 가입 기간이 180일 이상이면 신청 가능합니다.<br>
  50대 기준으로 최대 270일까지 지급 받을 수 있어요.<br>
  신청 방법: 워크넷(www.work.go.kr) 또는 가까운 고용복지플러스센터
</div>

<div class="post-example">
  <div class="post-example-label">자영업·가게 폐업 → 폐업 자영업자 지원</div>
  폐업한 지 1년 이내, 고용보험 자영업자로 가입했다면 실업급여에 준하는 급여 지급 가능.<br>
  가입이 안 돼 있어도 고용센터에서 "내일배움카드"로 직업훈련비 지원을 받을 수 있습니다.<br>
  신청: 고용복지플러스센터 방문 (전화 1350)
</div>

<h3>📋 3단계: 공공 일자리·취업 지원 연결</h3>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#16A34A;margin-bottom:6px;">빠르게 소득이 필요할 때 — 공공 일자리</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • <strong>노인 일자리 사업:</strong> 만 60세 이상이면 월 27만~40만 원 수준의 공공 일자리 연결. 주민센터·시니어클럽 신청<br>
      • <strong>지역 자활근로:</strong> 소득이 거의 없는 경우 주민센터에서 자활센터 연계. 월 80~130만 원 범위<br>
      • <strong>지자체 공공근로:</strong> 공원 관리, 환경미화, 행사 보조 등 단기 공공근로. 주민센터 공고 확인
    </div>
  </div>
  <div class="post-compare-row" style="background:#EFF6FF;border-color:#BFDBFE;">
    <div style="font-size:.8rem;font-weight:800;color:#2563EB;margin-bottom:6px;">안정적인 재취업을 목표로 할 때</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • <strong>중장년 일자리 희망센터:</strong> 전국 100여 곳 운영. 이력서 컨설팅, 취업 연계, 심리 상담 무료<br>
      • <strong>직업훈련 + 훈련수당:</strong> 내일배움카드로 자격증 과정 수강하면 월 11만~58만 원 훈련수당 지급<br>
      • <strong>동네로 일자리 알림:</strong> 주거지 인근 시니어 적합 공고를 매일 무료로 받아보세요
    </div>
  </div>
</div>

<h3>📞 위기 상황에서 바로 전화할 수 있는 번호</h3>

<div class="post-example">
  <div class="post-example-label">긴급 연락처 정리</div>
  <strong>복지 위기 상담:</strong> 129 (보건복지부, 24시간)<br>
  <strong>고용·취업 상담:</strong> 1350 (고용노동부, 평일 09~18시)<br>
  <strong>전세사기 피해:</strong> 1345 (법률구조공단, 무료 법률상담)<br>
  <strong>자활·생계 지원:</strong> 동네 주민센터 방문 (주민등록지 기준)
</div>

<div class="post-tip" style="background:#F0FDF4;border-color:#BBF7D0;">
  ✅ <strong>가장 먼저 해야 할 한 가지</strong><br>
  창피하다고 혼자 버티지 마세요. 주민센터 방문 한 번이 여러 제도의 출발점입니다. 상담사들은 이런 상황을 매일 보는 분들이에요. 내 상황을 솔직하게 말씀드릴수록 더 많은 연결 고리가 생깁니다.
</div>
    `
  },
  {
    id: 'severance-pay-2026',
    category: '급여·보험',
    categoryColor: '#059669',
    title: '퇴직금, 얼마나 받을 수 있나요? — 계산법부터 못 받았을 때 대처법까지',
    summary: '"나는 1년 안 됐으니까 퇴직금 없겠지"라고 포기하는 분들이 많아요. 정확한 기준과 계산법, 안 줄 때 신고 방법까지 처음부터 알려드립니다.',
    date: '2026-05-27',
    author: '동네로 운영팀',
    tags: ['퇴직금', '퇴직급여', '50대퇴직', '임금체불', '고용보험'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
충북 청주에 사시는 이정숙 씨(59세)는 4년 다닌 요양원을 그만뒀습니다.<br>
퇴직 후 한 달이 지나도 퇴직금이 들어오지 않았어요.<br>
원장님께 여쭤봤더니 이런 말이 돌아왔습니다.<br><br>
<em>"파트타임이잖아요. 퇴직금은 정직원한테만 나와요."</em><br><br>
이정숙 씨는 그 말을 듣고 "그런가 보다" 하고 넘어가려 했어요.<br>
그런데 딸이 고용노동부에 전화해 알아보니, 파트타임이어도 조건만 맞으면 퇴직금을 받을 수 있다는 답변이 왔습니다.<br>
결국 이정숙 씨는 4년치 퇴직금 약 480만 원을 받았어요.
</p>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  ⚠️ <strong>"파트타임이라서 없대요", "3개월 수습이라서 안 된대요"</strong> — 이런 말들이 사실인 경우도 있고, 거짓말인 경우도 있습니다. 내 상황이 어디에 해당하는지, 아래에서 정확히 확인하세요.
</div>

<h3>✅ 퇴직금 받을 수 있는 조건 — 딱 두 가지입니다</h3>

<div class="post-example">
  <div class="post-example-label">퇴직금 수급 조건</div>
  <strong>① 같은 사업장에서 1년 이상 계속 근무</strong><br>
  계약이 중간에 끊겼다가 이어졌어도, 실질적으로 같은 사업장에서 계속 일했다면 합산할 수 있는 경우가 있어요.<br><br>
  <strong>② 주 평균 근무시간이 15시간 이상</strong><br>
  파트타임, 시간제 근로자도 주 15시간 이상이면 해당됩니다. 고용 형태(정규직·계약직·시간제)와 무관해요.
</div>

<div class="post-tip">
  💡 <strong>이것만 기억하세요:</strong> 정규직이냐 아르바이트냐가 아닌, "1년 이상 + 주 15시간 이상"이 기준입니다. 조건을 모두 충족한다면 사업주는 반드시 퇴직금을 지급해야 합니다.
</div>

<h3>❌ 이런 경우는 퇴직금이 없습니다</h3>

<div class="post-compare">
  <div class="post-compare-row" style="background:#FEF2F2;border-color:#FECACA;">
    <div style="font-size:.8rem;font-weight:800;color:#DC2626;margin-bottom:6px;">퇴직금 해당 없는 경우</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • 근속 기간이 1년 미만인 경우 (11개월 29일도 해당 없음)<br>
      • 주 평균 15시간 미만 근무 (예: 주 2일 × 4시간 = 8시간)<br>
      • 사업주의 직계가족인 경우 (부모님 가게에서 함께 일하는 경우 등)<br>
      • 퇴직연금(DC형)에 가입된 경우 — 이땐 연금 계좌로 적립됨
    </div>
  </div>
</div>

<h3>💰 퇴직금은 얼마나 받나요? — 계산법</h3>
<p>퇴직금은 <strong>"1일 평균임금 × 30일 × (근속연수)"</strong>로 계산합니다. 복잡해 보이지만 예시로 보면 이해하기 쉬워요.</p>

<div class="post-example">
  <div class="post-example-label">📊 퇴직금 계산 예시</div>
  <strong>상황:</strong> 시급 12,000원으로 주 5일·하루 4시간 근무, 2년 근속<br><br>
  <strong>1단계 — 3개월 평균임금 계산</strong><br>
  월 급여 = 시급 12,000원 × 4시간 × 22일 + 주휴수당 ≈ 1,152,000원<br>
  3개월 합산 ÷ 90일 = <strong>1일 평균임금 약 38,400원</strong><br><br>
  <strong>2단계 — 퇴직금 계산</strong><br>
  38,400원 × 30일 × 2년 = <strong>약 2,304,000원</strong><br><br>
  ✅ 주휴수당, 연장근로수당도 평균임금에 포함됩니다.
</div>

<div class="post-tip">
  📱 <strong>직접 계산하기 어려우면:</strong><br>
  고용노동부 퇴직금계산기 → work24.go.kr 접속 → "퇴직금 계산기" 검색<br>
  월급, 근무기간 넣으면 자동으로 계산해줍니다.
</div>

<h3>📋 언제, 어떻게 받나요?</h3>

<div class="post-example">
  <div class="post-example-label">퇴직금 지급 기준</div>
  <strong>지급 시기:</strong> 퇴직일로부터 <strong>14일 이내</strong>에 지급해야 합니다.<br>
  (당사자 간 합의가 있으면 연장 가능하지만, 합의 없이 늦추면 법 위반)<br><br>
  <strong>지급 방법:</strong> 은행 계좌로 이체하거나, 퇴직연금(IRP 계좌)으로 이전<br><br>
  <strong>세금:</strong> 퇴직금에는 퇴직소득세가 붙지만, 근속연수가 길수록 공제가 커서 실제 세금은 적어요.<br>
  (근속 10년 이하라면 대부분 세금이 거의 없거나 아주 적습니다)
</div>

<h3>🚨 퇴직금을 안 줄 때 — 단계별 대처법</h3>
<p>퇴직 후 14일이 지났는데도 퇴직금이 들어오지 않거나, 사업주가 "없다"고 한다면 아래 순서대로 움직이세요.</p>

<div class="post-example">
  <div class="post-example-label">대처 순서</div>
  <strong>1단계 — 문자·카톡으로 내용증명 남기기</strong><br>
  사업주에게 이렇게 문자를 보내세요.<br>
  <em>"안녕하세요. ○○○입니다. 퇴직일로부터 14일이 지났는데 아직 퇴직금을 받지 못했습니다. 빠른 처리 부탁드립니다."</em><br>
  → 문자로 남겨두면 나중에 증거가 됩니다.<br><br>
  <strong>2단계 — 고용노동부 고객상담센터 전화</strong><br>
  ☎ <strong>1350</strong> (무료, 평일 09:00~18:00)<br>
  "퇴직금을 못 받고 있는데 어떻게 해야 하나요?"라고 하면 됩니다. 신고 방법을 안내받을 수 있어요.<br><br>
  <strong>3단계 — 진정서 접수</strong><br>
  고용노동부 홈페이지(moel.go.kr) 또는 가까운 지방고용노동청에 직접 방문해 진정서를 제출합니다.<br>
  사업주에게 조사가 들어가고, 대부분 이 단계에서 해결됩니다.
</div>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  ⚠️ <strong>신고 기한:</strong> 퇴직일로부터 <strong>3년 안에</strong> 신고해야 합니다. 3년이 지나면 청구권이 소멸되니 미루지 마세요.
</div>

<h3>📂 미리 챙겨두면 좋은 증거 자료</h3>
<p>퇴직금 분쟁이 생겼을 때 아래 자료가 있으면 훨씬 유리합니다. 일하는 동안 틈틈이 모아두세요.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">챙겨두면 좋은 것들</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      ✔ <strong>근로계약서</strong> (가장 중요. 없다면 사업주에게 재발급 요청)<br>
      ✔ <strong>급여명세서 또는 통장 입금 내역</strong> (근무 기간·급여 입증용)<br>
      ✔ <strong>출퇴근 기록</strong> (사진, 문자, 앱 기록 등 무엇이든)<br>
      ✔ <strong>사업주와 나눈 문자·카카오톡 내용</strong><br>
      ✔ <strong>4대보험 가입 확인서</strong> — 국민건강보험공단 앱에서 조회 가능
    </div>
  </div>
</div>

<h3>❓ 자주 묻는 질문</h3>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:4px;">Q. 계약직인데 퇴직금 받을 수 있나요?</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      네. 계약직도 조건(1년 이상, 주 15시간 이상)을 충족하면 받을 수 있어요. 계약 갱신을 반복해서 실질적으로 1년이 넘었다면 청구할 수 있는 경우가 많아요.
    </div>
  </div>
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:4px;">Q. 자진 퇴사해도 퇴직금 받을 수 있나요?</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      네. 퇴직금은 퇴직 이유와 무관합니다. 본인이 그만뒀든, 권고사직이든, 계약 만료든 조건만 맞으면 무조건 받을 수 있어요.
    </div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:4px;">Q. 사업주가 "나중에 줄게요"라고 하면?</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      법적으로는 퇴직 후 14일 이내 지급 의무가 있어요. "나중에"는 당사자 합의 시에만 가능하고, 합의 내용을 문서로 남겨두세요. 기한을 너무 길게 미루면 지연이자도 청구할 수 있습니다.
    </div>
  </div>
</div>

<div class="post-tip">
  🛡️ <strong>퇴직금은 근로기준법으로 보장된 권리입니다.</strong><br>
  "사이가 나빠질까봐", "나중에 일자리 소개 받을까봐" 포기하는 분들이 많은데, 받을 것은 받으셔야 합니다.<br><br>
  상담·신고: 고용노동부 ☎ 1350 (무료, 평일 09:00~18:00)<br>
  온라인 신고: 고용노동부(moel.go.kr) → 민원마당 → 임금체불 진정
</div>
`
  },
  {
    id: 'caregiving-license-2026',
    category: '자격증·교육',
    categoryColor: '#0891B2',
    title: '요양보호사 자격증, 지금 따면 바로 취직됩니다 — 비용·기간·취업까지 현실 가이드',
    summary: '자격증 없어도 신청 가능, 국비로 거의 무료, 합격률 90% 이상. 50~60대 취업 스펙 1순위인 요양보호사 자격증 취득 과정을 처음부터 끝까지 알려드립니다.',
    date: '2026-05-19',
    author: '동네로 운영팀',
    tags: ['요양보호사', '자격증', '국비교육', '50대취업', '60대취업', '시니어취업'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
경기도 고양시에 사시는 이순희 씨(59세)는 작년 9월에 요양보호사 자격증을 땄습니다.<br>
교육비는 국민내일배움카드로 해결했고, 수업 들은 지 4개월 만에 자격증이 나왔어요.<br>
자격증이 나온 그 주에 바로 동네 방문요양센터에 연락했고, 3일 뒤부터 일을 시작했습니다.<br><br>
<em>"이렇게 빨리 될 줄 몰랐어요. 나이 드신 분들 도와드리는 일이라 처음엔 내가 할 수 있을까 걱정했는데, 교육에서 다 가르쳐줘서 막상 해보니까 적성에도 맞더라고요."</em>
</p>

<div class="post-tip">
  💡 요양보호사는 현재 우리나라에서 <strong>수요가 가장 많은 직종 중 하나</strong>입니다. 고령화가 빨라지면서 앞으로도 수요는 계속 늘어납니다. 자격증만 있으면 전국 어디서나 일자리를 찾을 수 있어요.
</div>

<h3>📋 요양보호사가 하는 일 — 구체적으로 어떤 일인가요?</h3>
<p>어르신의 일상 생활을 곁에서 도와드리는 일입니다. 크게 두 가지 방식으로 일합니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">① 방문요양 (집으로 찾아가는 방식)</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      어르신 댁에 직접 방문해서 도움을 드려요.<br>
      • 식사 준비·드시는 것 도움<br>
      • 목욕·몸 씻기·옷 갈아입기 보조<br>
      • 병원 동행, 산책 동행<br>
      • 말벗, 인지 활동<br>
      <strong>시간이 유연해서 오전·오후 원하는 시간대에 일할 수 있어요.</strong>
    </div>
  </div>
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">② 요양원·시설 근무 (출퇴근 방식)</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      요양원, 주야간보호센터 같은 시설에 출퇴근하며 일해요.<br>
      • 어르신 일상 케어 (식사·목욕·이동 보조)<br>
      • 활동 프로그램 보조<br>
      • 야간 당직 근무도 있음 (추가 수당)<br>
      <strong>고정 출퇴근이라 급여가 안정적이에요.</strong>
    </div>
  </div>
</div>

<h3>✅ 자격증 따려면 뭐가 필요한가요?</h3>
<p>조건이 거의 없습니다. 나이, 학력 제한이 따로 없어요. 아래 두 가지만 확인하면 됩니다.</p>

<div class="post-example">
  <div class="post-example-label">요양보호사 교육 신청 조건</div>
  ✔ <strong>나이:</strong> 만 18세 이상이면 누구나 (사실상 제한 없음)<br>
  ✔ <strong>학력:</strong> 학력 무관 (중졸, 고졸, 대졸 모두 가능)<br>
  ✔ <strong>필요 서류:</strong> 신분증 + 건강검진 결과서(기관에서 안내해줌)<br><br>
  ❌ 전공, 자격증, 경력 — 전혀 없어도 됩니다.
</div>

<h3>📅 교육 기간과 커리큘럼</h3>
<p>총 240시간을 이수해야 합니다. 이론 80시간 + 실기 80시간 + 현장실습 80시간으로 구성됩니다.</p>

<div class="post-example">
  <div class="post-example-label">실제 교육 일정 예시 (주 3일 수업 기준)</div>
  월·수·금 오전 10시~오후 3시 수업 → <strong>약 3~4개월</strong>이면 이수 완료<br>
  주 5일 집중 수업 선택 시 → <strong>약 2개월</strong>에 이수 가능<br><br>
  ✔ 출석 80% 이상 충족하면 수료<br>
  ✔ 현장실습은 주로 근처 요양원에서 진행 (교육원이 연계해줌)
</div>

<h3>💰 교육비는 얼마나 드나요?</h3>
<p>정가는 40~80만원 수준이지만, <strong>국민내일배움카드</strong>를 이용하면 거의 무료로 들을 수 있습니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">국민내일배움카드란?</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      정부가 국민 누구에게나 발급해주는 직업훈련 지원 카드입니다.<br>
      300~500만원의 훈련비를 지원받고, 그 범위 안에서 교육비를 카드로 결제하면 됩니다.<br><br>
      대부분의 요양보호사 교육 과정이 지원 가능 목록에 포함되어 있어요.<br>
      <strong>→ 교육비가 80만원이라도 실제 본인 부담은 10~20만원 수준으로 줄어드는 경우가 많습니다.</strong>
    </div>
  </div>
</div>

<div class="post-example">
  <div class="post-example-label">국민내일배움카드 신청 방법</div>
  <strong>1단계:</strong> HRD-Net (hrd.go.kr) 접속 → 회원가입<br>
  <strong>2단계:</strong> "내일배움카드 신청" 클릭 → 온라인 신청 (또는 고용센터 방문)<br>
  <strong>3단계:</strong> 카드 수령 (약 2~3주 소요)<br>
  <strong>4단계:</strong> HRD-Net에서 요양보호사 교육 과정 검색 → 신청<br><br>
  ☎ 상담: 고용노동부 고객상담센터 <strong>1350</strong> (무료, 평일 09:00~18:00)
</div>

<div class="post-tip">
  💡 이미 실직 상태라면 "국민취업지원제도"와 함께 신청하면 훈련비 지원 + 월 최대 50만원 취업활동비도 받을 수 있어요. 고용센터에서 한 번에 안내받으세요.
</div>

<h3>📝 국가시험 — 얼마나 어렵나요?</h3>
<p>합격률이 <strong>90% 이상</strong>입니다. 교육을 성실하게 이수했다면 대부분 합격합니다.</p>

<div class="post-example">
  <div class="post-example-label">시험 정보</div>
  <strong>시행 기관:</strong> 한국보건의료인국가시험원 (국시원, kuksiwon.or.kr)<br>
  <strong>시험 횟수:</strong> 연 6회 (약 2개월에 1회)<br>
  <strong>시험 과목:</strong> 요양보호론 (필기 35문제 + 실기 45문제, 총 80문제)<br>
  <strong>합격 기준:</strong> 필기·실기 각각 60% 이상 (36점·27점 이상)<br>
  <strong>시험 시간:</strong> 70분<br><br>
  ✔ 교육 이수 후 국시원 홈페이지에서 직접 접수<br>
  ✔ 응시료: 약 3~4만원
</div>

<h3>💼 자격증 따고 나면 — 취업이 얼마나 빠를까요?</h3>
<p>자격증 발급 직후부터 바로 구직이 가능합니다. 요양원이나 방문요양센터는 항상 인력이 부족해서 자격증만 있으면 대기가 거의 없습니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#FFF7ED;border-color:#FED7AA;">
    <div style="font-size:.8rem;font-weight:800;color:#C2410C;margin-bottom:6px;">방문요양 급여 (2026년 기준)</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      시급: <strong>11,000~13,000원</strong> 수준<br>
      월 2~4시간 × 10~15명 어르신 담당 → 월 수입 80~150만원<br>
      이동 시간 포함 여부는 센터마다 다름<br>
      <strong>출퇴근 자유 / 파트타임 가능 / 집 근처에서 일 가능</strong>
    </div>
  </div>
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">요양원·주야간보호센터 급여</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      월 200~240만원 (주 40시간 기준)<br>
      야간 추가 수당 별도<br>
      4대보험 가입, 퇴직금 적용<br>
      <strong>고정 수입 / 안정적 환경 / 경력 쌓기에 유리</strong>
    </div>
  </div>
</div>

<h3>🔍 일자리 찾는 방법</h3>
<ul>
  <li><strong>동네로 (dongnero.kr)</strong> — 요양·돌봄 카테고리에서 내 동네 공고 검색</li>
  <li><strong>복지로 (bokjiro.go.kr)</strong> — "요양보호사 구인" 검색</li>
  <li><strong>시니어클럽</strong> — 자격증 보유자 우선 배치하는 경우 많음</li>
  <li><strong>직접 방문</strong> — 동네 방문요양센터에 자격증 들고 직접 찾아가도 됩니다. 10곳 중 7곳은 바로 면접을 봅니다.</li>
</ul>

<div class="post-tip">
  📌 <strong>요양보호사 자격증 취득 한 줄 요약</strong><br>
  국민내일배움카드 신청 → 교육 이수(3~4개월) → 국가시험 응시 → 합격 → 즉시 취업<br><br>
  지금 당장 시작하면 <strong>올 가을부터 일할 수 있습니다.</strong> 고용센터 ☎ 1350에 전화해서 "요양보호사 자격증 취득 지원 받고 싶다"고 하면 다음 단계를 안내받을 수 있어요.
</div>
`
  },
  {
    id: 'unemployment-benefit-2026',
    category: '생활 지원',
    categoryColor: '#0F766E',
    title: '퇴직하면 실업급여 받을 수 있나요? — 50대가 꼭 알아야 할 신청 가이드',
    summary: '"나는 해당 안 되겠지"라고 포기하는 분들이 너무 많아요. 조건만 맞으면 50대, 60대도 받을 수 있습니다. 얼마나, 얼마 동안, 어떻게 신청하는지 처음부터 알려드릴게요.',
    date: '2026-05-18',
    author: '동네로 운영팀',
    tags: ['실업급여', '퇴직급여', '50대퇴직', '재취업지원', '고용보험'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
경기도 수원에 사시는 김명숙 씨(57세)는 10년 다닌 회사에서 희망퇴직 권고를 받았습니다.<br>
퇴직 후 처음 한 달은 그냥 쉬었어요. 실업급여라는 게 있다는 건 알았지만,<br>
<em>"나 같은 경우엔 해당이 안 되겠지. 복잡하고 귀찮을 것 같고…"</em><br><br>
그런데 딸이 옆에서 챙겨줘서 신청해보니 매달 160만원씩 8개월을 받았습니다.<br>
총 1,280만원. "진작 신청할 걸"이라는 말을 몇 번이나 하셨다고 해요.
</p>

<div class="post-tip">
  💡 실업급여는 '실직한 사람이 받는 지원금'입니다. 조건만 맞으면 나이와 상관없이 받을 수 있어요. 50대, 60대도 해당됩니다.
</div>

<h3>✅ 받을 수 있는 조건 — 4가지 모두 해당돼야 합니다</h3>

<div class="post-example">
  <div class="post-example-label">실업급여 수급 조건</div>
  <strong>① 고용보험 가입 기간이 180일(약 6개월) 이상</strong><br>
  퇴직 전 18개월 안에 고용보험 가입 기간이 합쳐서 180일 이상이어야 합니다.<br>
  하루 4시간, 주 15시간 이상 일했다면 자동으로 가입되어 있을 가능성이 높아요.<br><br>
  <strong>② 비자발적 퇴직 (내 의사와 다르게 그만두게 된 경우)</strong><br>
  권고사직, 계약 만료, 사업장 폐업, 부당해고 등이 해당됩니다.<br><br>
  <strong>③ 적극적으로 재취업 활동을 하고 있을 것</strong><br>
  그냥 쉬는 게 아니라 구직 중이어야 합니다. 고용센터에서 확인합니다.<br><br>
  <strong>④ 근로 능력이 있을 것</strong><br>
  건강상 일할 수 없는 상태라면 별도 상병급여 등으로 연결됩니다.
</div>

<h3>🤔 "자발적으로 그만뒀는데 저는 안 되나요?"</h3>
<p>자발적 퇴직이어도 받을 수 있는 경우가 있습니다. 아래 중 하나라도 해당되면 꼭 확인하세요.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0FDF4;border-color:#BBF7D0;">
    <div style="font-size:.8rem;font-weight:800;color:#15803D;margin-bottom:6px;">자발적 퇴직이어도 받을 수 있는 경우</div>
    <div style="font-size:.88rem;color:#374151;line-height:1.9;">
      • 임금이 3개월 이상 체불됐을 때<br>
      • 최저임금 이하로 받았을 때<br>
      • 직장 내 괴롭힘, 성희롱 피해가 있었을 때<br>
      • 갑자기 근무지가 왕복 3시간 이상 걸리는 곳으로 바뀌었을 때<br>
      • 부모님 간호, 배우자 직장 이동 등 불가피한 가족 사정<br>
      • 건강 악화로 해당 업무 수행이 어려워진 경우
    </div>
  </div>
</div>

<div class="post-tip" style="background:#FEF2F2;border-color:#FECACA;">
  ⚠️ 단순히 "힘들어서", "더 좋은 곳 가려고" 그만둔 경우는 해당이 안 됩니다. 퇴직 이유를 꼭 확인하세요.
</div>

<h3>💰 얼마나 받나요?</h3>
<p>실업급여(구직급여) 금액은 퇴직 전 평균임금의 60%입니다. 단, 상한액과 하한액이 있어요.</p>

<div class="post-example">
  <div class="post-example-label">2026년 기준 금액</div>
  <strong>하루 최대(상한액):</strong> 66,000원<br>
  <strong>하루 최소(하한액):</strong> 최저임금의 80% × 8시간 = 약 64,192원<br><br>
  실제로는 상한액과 하한액 차이가 크지 않아서, <strong>대부분 하루 6~7만원</strong> 수준을 받습니다.<br><br>
  <strong>예시 계산:</strong><br>
  하루 66,000원 × 30일 = 한 달 약 198만원<br>
  하루 64,192원 × 30일 = 한 달 약 192만원
</div>

<h3>📅 얼마나 오래 받나요?</h3>
<p>나이와 고용보험 가입 기간에 따라 달라집니다.</p>

<div class="post-compare">
  <div class="post-compare-row" style="background:#F0F9FF;border-color:#BAE6FD;">
    <div style="font-size:.8rem;font-weight:800;color:#0369A1;margin-bottom:6px;">50세 이상 또는 장애인 수급 기간</div>
    <div style="font-size:.88rem;color:#374151;line-height:2;">
      가입 기간 1~3년 미만 → <strong>180일 (약 6개월)</strong><br>
      가입 기간 3~5년 미만 → <strong>210일 (약 7개월)</strong><br>
      가입 기간 5~10년 미만 → <strong>240일 (약 8개월)</strong><br>
      가입 기간 10년 이상 → <strong>270일 (약 9개월)</strong>
    </div>
  </div>
</div>

<div class="post-tip">
  💡 50세 이상은 같은 조건의 젊은 분들보다 수급 기간이 30~60일 더 깁니다. 나이가 오히려 유리한 경우예요.
</div>

<h3>📋 신청 방법 — 단계별로 따라오세요</h3>

<div class="post-example">
  <div class="post-example-label">실업급여 신청 순서</div>
  <strong>1단계 — 퇴직 후 바로 고용보험 홈페이지 접속</strong><br>
  고용보험(ei.go.kr) → 수급자격 온라인 교육 (1시간, 집에서 가능)<br><br>
  <strong>2단계 — 가까운 고용복지플러스센터 방문</strong><br>
  신분증 지참. "실업급여 신청하러 왔습니다"라고 하면 안내받습니다.<br>
  전화 예약: ☎ 1350<br><br>
  <strong>3단계 — 수급자격 인정 신청</strong><br>
  센터에서 서류 검토 후 수급자격 결정 (보통 2~3주 소요)<br><br>
  <strong>4단계 — 매 1~4주마다 실업인정 신청</strong><br>
  고용보험 홈페이지 또는 센터 방문으로 구직활동 보고 → 급여 지급
</div>

<div class="post-example">
  <div class="post-example-label">📂 준비 서류</div>
  ✔ 신분증<br>
  ✔ 통장 사본 (본인 명의)<br>
  ✔ 이직확인서 (회사에서 발급, 또는 고용센터에서 요청 가능)<br>
  ✔ 근로계약서 (있으면 챙겨가세요)
</div>

<h3>❌ 이런 경우 못 받거나 끊깁니다</h3>
<ul>
  <li>취업한 사실을 신고 안 하고 계속 수령 → 부정수급, 전액 반환 + 추가 제재</li>
  <li>구직활동을 하지 않고 실업인정 신청만 할 경우 → 지급 정지</li>
  <li>정당한 이유 없이 취업 알선을 2회 이상 거부하면 → 지급 중단</li>
</ul>

<div class="post-tip">
  🛡️ <strong>모르면 손해입니다</strong><br>
  신청 기한이 따로 있어요. 퇴직일 다음 날부터 12개월 안에 신청하지 않으면 받을 수 없습니다.<br>
  퇴직하셨거나 계약이 만료됐다면 <strong>지금 바로 확인</strong>해보세요.<br><br>
  고용보험 가입 이력 확인: 고용보험(ei.go.kr) → 개인서비스 → 고용보험 가입이력 조회<br>
  상담: ☎ 1350 (무료, 평일 09:00~18:00)
</div>
`
  },
  {
    id: 'interview-senior-2026',
    category: '취업 준비',
    categoryColor: '#0891B2',
    title: '50대 첫 면접, 이것만 알면 떨리지 않아요 — 시니어 면접 완전 준비 가이드',
    summary: '"나이가 많아서 떨어진 건 아닐까"라는 걱정, 다들 하시죠. 실제로 면접관이 원하는 게 뭔지, 나이 얘기 나오면 어떻게 받아치는지 구체적인 스크립트로 알려드립니다.',
    date: '2026-05-16',
    author: '동네로 운영팀',
    tags: ['면접준비', '50대면접', '60대재취업', '시니어면접', '취업준비'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
인천에 사시는 최정남 씨(58세)는 퇴직 후 처음으로 편의점 면접을 보러 갔습니다.<br>
면접 전날 밤, 잠이 안 왔다고 하셨어요.<br><br>
<em>"20년 넘게 회사 다니면서 남들 면접은 수십 번 봤는데, 내가 면접 보러 가려니까 이렇게 긴장될 줄 몰랐어요. 내 나이가 너무 많은 거 아닌지, 옷은 뭘 입어야 하는지…"</em><br><br>
결과는 합격이었습니다. 면접관이 나중에 이렇게 말했다고 해요.<br>
"오히려 연배 있으신 분이 믿음직스러웠어요."
</p>

<div class="post-tip">
  💡 면접에서 나이는 약점이 아닙니다. 단, 준비가 되어 있어야 합니다. 이 글에서 알려드리는 것들만 챙기셔도 합격률이 확 달라집니다.
</div>

<h3>📋 면접 하루 전, 이것만 챙기세요</h3>
<p>복잡하게 생각하지 마세요. 딱 세 가지만 확인하면 됩니다.</p>

<div class="post-example">
  <div class="post-example-label">✅ 면접 전날 체크리스트</div>
  □ 회사 위치·교통편 미리 확인 (당일 헤매면 지각 위험)<br>
  □ 입을 옷 준비 — 깔끔하고 단정하게, 너무 격식 차릴 필요 없음<br>
  □ "왜 이 일을 하고 싶으세요?" 한 문장으로 정리해두기<br>
  □ 지원한 업체 이름·하는 일 간단히 파악하기<br>
  □ 핸드폰 충전·알람 설정
</div>

<h3>💬 면접에서 자주 나오는 질문 TOP 5 — 실제 답변 예시</h3>

<p><strong>Q1. "간단하게 자기소개 해주세요."</strong></p>
<p>긴 직장 이력을 줄줄 읊지 않아도 됩니다. 30초 안에 끝내는 게 좋아요.</p>
<div class="post-example">
  <div class="post-example-label">💬 이렇게 말해보세요</div>
  "안녕하세요, 최정남입니다. 오랫동안 제조업에 종사하다가 이번에 새로운 시작을 하려고 합니다. 성실하게 배우면서 일하는 것을 중요하게 생각합니다. 잘 부탁드립니다."
</div>

<p><strong>Q2. "왜 이 일을 하고 싶으세요?"</strong></p>
<p>거창한 이유가 없어도 됩니다. 솔직하고 구체적인 게 훨씬 낫습니다.</p>
<div class="post-example">
  <div class="post-example-label">💬 이렇게 말해보세요</div>
  "집에서 가깝고, 오전 시간대에 일할 수 있어서 지원했습니다. 몸도 건강하고 아직 일할 수 있는데 집에만 있기가 아쉬워서요. 작은 일도 꼼꼼하게 하는 편입니다."
</div>

<p><strong>Q3. "나이가 있으신데, 체력적으로 괜찮으세요?"</strong></p>
<p>이 질문이 제일 당황스럽죠. 방어적으로 받아치면 안 됩니다. 자신 있게, 짧게.</p>
<div class="post-example">
  <div class="post-example-label">💬 이렇게 말해보세요</div>
  "네, 꾸준히 걷기 운동을 하고 있어서 체력은 자신 있습니다. 오히려 젊은 분들보다 꾸준히 오래 일하는 게 장점이라고 생각합니다."
</div>

<p><strong>Q4. "불편한 상황이 생기면 어떻게 하실 것 같아요?"</strong></p>
<p>작은 가게나 편의점 면접에서 자주 나옵니다. 튀는 답변보다 안심시켜 주는 답변이 좋아요.</p>
<div class="post-example">
  <div class="post-example-label">💬 이렇게 말해보세요</div>
  "일단 상황을 차분하게 파악하고, 모르는 건 바로 여쭤보겠습니다. 경험이 많다 보니 당황하지 않고 처리하는 편입니다."
</div>

<p><strong>Q5. "언제부터 가능하세요?"</strong></p>
<p>이 질문이 나오면 거의 합격입니다. 너무 뜸들이지 말고 구체적으로 답하세요.</p>
<div class="post-example">
  <div class="post-example-label">💬 이렇게 말해보세요</div>
  "다음 주 월요일부터 바로 가능합니다."
</div>

<h3>👔 복장 — 이것만 기억하세요</h3>
<p>편의점·청소·요양·주방 보조 등 생활 밀착형 알바는 <strong>정장보다 깔끔한 캐주얼</strong>이 오히려 자연스럽습니다. 면접관도 현장 감각이 있는 분을 원하거든요.</p>

<div class="post-example">
  <div class="post-example-label">✅ 복장 기준</div>
  ✔ 깨끗하게 다린 셔츠나 블라우스<br>
  ✔ 무릎 아래 오는 치마 또는 깔끔한 면바지<br>
  ✔ 운동화도 깨끗하면 괜찮음 (샌들·슬리퍼는 피하기)<br>
  ✔ 향수는 자제, 머리카락은 단정하게<br>
  ✘ 형광색·화려한 패턴은 피하기<br>
  ✘ 청바지+후드 조합은 너무 편한 인상
</div>

<h3>🕐 면접 당일, 이것만 주의하세요</h3>

<div class="post-example">
  <div class="post-example-label">📌 3가지 황금 원칙</div>
  <strong>1. 10분 일찍 도착하기</strong><br>
  늦는 것만큼 나쁜 인상은 없습니다. 일찍 도착해서 화장실에서 옷매무새를 확인하고 마음을 가다듬으세요.<br><br>
  <strong>2. 끝까지 웃으면서 인사하기</strong><br>
  면접이 잘 됐든 못 됐든, 마지막에 "감사합니다, 잘 부탁드립니다"라고 인사하고 나오세요. 마지막 인상이 오래 남습니다.<br><br>
  <strong>3. 모르는 건 모른다고 하기</strong><br>
  POS기나 앱 사용법 같은 건 모른다고 해도 됩니다. "배우는 건 자신 있습니다"를 붙이면 오히려 솔직해 보여서 좋은 인상을 줍니다.
</div>

<h3>💡 면접 후에도 한 번 더 — 문자 감사 인사</h3>
<p>면접이 끝나고 몇 시간 뒤, 짧게 문자 한 통 보내보세요. 많은 분들이 모르시는 방법인데, 효과가 꽤 있습니다.</p>
<div class="post-example">
  <div class="post-example-label">💬 문자 예시</div>
  "안녕하세요, 오늘 오전에 면접을 봤던 최정남입니다. 좋은 자리에서 만나 뵙게 되어 감사했습니다. 잘 부탁드리겠습니다."
</div>
<p>간결하고 예의 바른 문자 한 통이 경쟁자와 차별화 포인트가 될 수 있습니다.</p>

<div class="post-tip">
  🌟 마지막으로 — 면접은 "나를 팔러 가는 자리"가 아니라 "서로 맞는지 확인하는 자리"입니다. 긴장은 당연한 겁니다. 준비한 만큼 자신 있게 임하시면 됩니다. 응원합니다!
</div>
`
  },
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
  },

  {
    id: 'insurance-parttime-2026',
    category: '급여·보험',
    categoryColor: '#059669',
    title: '단기알바도 4대보험 들어야 하나요? — 시니어가 꼭 알아야 할 보험 상식',
    summary: '퇴직 후 처음 알바를 시작했는데 월급에서 생각보다 많이 빠져서 놀라셨나요? 4대보험이 언제 적용되고 얼마나 내는지, 알면 덜 당황합니다.',
    date: '2026-05-22',
    author: '동네로 운영팀',
    tags: ['4대보험', '건강보험', '알바', '급여', '시니어'],
    content: `
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
박순자 씨(58세)는 마트 계산원 파트타임을 시작했어요.<br>
첫 월급날, 통장을 보고 눈을 비볐습니다.<br><br>
"분명 시급 12,000원이라고 했는데… 왜 이렇게 적게 들어왔지?"<br><br>
급여명세서를 보니 건강보험, 국민연금, 고용보험 항목이 줄줄이 빠져 있었어요.<br>
"이게 다 뭐야, 설명도 없이…"<br><br>
처음 일을 시작하시는 분들이 가장 많이 놀라는 순간이 바로 이때입니다. 미리 알면 전혀 당황할 일이 없어요.
</p>

<h3>4대보험이 뭔가요?</h3>
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
직장에 다니면 회사와 직원이 함께 부담하는 4가지 사회보험이에요.
</p>

<div style="background:#F0FDF4;border-left:4px solid #059669;padding:16px 20px;border-radius:8px;margin:20px 0;">
  <strong>4대보험 한눈에 보기</strong><br><br>
  🏥 <strong>건강보험</strong> — 병원비 지원. 보수월액의 약 3.545% (직원 부담)<br>
  👴 <strong>국민연금</strong> — 나중에 연금으로 돌려받음. 보수월액의 4.5%<br>
  💼 <strong>고용보험</strong> — 실직 시 실업급여 재원. 보수월액의 0.9%<br>
  🦺 <strong>산재보험</strong> — 업무상 다쳤을 때. <strong>100% 회사 부담</strong> (직원은 0원)
</div>

<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
즉 월급에서 실제로 빠지는 건 건강보험 + 국민연금 + 고용보험, 이렇게 세 가지예요.
</p>

<h3>단기알바, 시간제 일도 적용되나요?</h3>
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
많이들 "단기니까 보험 없겠지"라고 생각하시는데, 기준은 기간이 아니라 <strong>근무 시간</strong>이에요.
</p>

<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:20px 0;">
  <strong>📋 4대보험 적용 기준</strong><br><br>
  <table style="width:100%;border-collapse:collapse;font-size:.95rem;">
    <tr style="background:#E2E8F0;">
      <th style="padding:10px;text-align:left;border-radius:4px;">구분</th>
      <th style="padding:10px;text-align:left;">적용 여부</th>
    </tr>
    <tr style="border-bottom:1px solid #E2E8F0;">
      <td style="padding:10px;"><strong>주 15시간 미만</strong> 단기·일용직</td>
      <td style="padding:10px;color:#DC2626;">국민연금·건강보험 적용 제외</td>
    </tr>
    <tr style="border-bottom:1px solid #E2E8F0;">
      <td style="padding:10px;"><strong>주 15시간 이상</strong> 시간제</td>
      <td style="padding:10px;color:#059669;">4대보험 전부 적용</td>
    </tr>
    <tr>
      <td style="padding:10px;"><strong>일용직</strong> (하루 단위 계약)</td>
      <td style="padding:10px;">고용·산재보험만 적용 (건강·연금 제외)</td>
    </tr>
  </table>
</div>

<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
마트 파트타임, 학교 급식 보조, 요양원 시간제처럼 <strong>주 15시간 넘게 일하면 4대보험이 붙어요.</strong><br>
반대로 주 15시간 미만이면 고용보험·산재보험만 들어요.
</p>

<h3>실제로 얼마나 빠지나요?</h3>
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
월 200만 원 받는다고 가정하면 이렇게 됩니다.
</p>

<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:20px 0;">
  <strong>💰 월 200만 원 기준 공제액 예시</strong><br><br>
  건강보험: 약 71,000원<br>
  장기요양보험 (건강보험의 12.95%): 약 9,000원<br>
  국민연금: 약 90,000원<br>
  고용보험: 약 18,000원<br>
  <hr style="margin:10px 0;border-color:#E2E8F0;">
  <strong>합계 약 188,000원 공제 → 실수령 약 1,812,000원</strong>
</div>

<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
많아 보이지만, 이 중 국민연금(9만 원)은 나중에 연금으로 돌려받는 돈이에요.<br>
병원을 자주 다니신다면 건강보험은 오히려 훨씬 이득이고요.
</p>

<h3>이미 지역가입자인데 또 내야 하나요?</h3>
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
퇴직 후 지역가입자로 건강보험을 직접 내고 계신 분들이 많으세요.<br>
취업하면 <strong>직장가입자로 자동 전환</strong>돼서 지역가입 보험료가 없어져요.<br><br>
그리고 직장가입 보험료는 회사가 절반을 내줘서, 보통 지역가입보다 <strong>더 적게 내는 경우가 많아요.</strong><br>
오히려 유리할 수 있다는 뜻입니다.
</p>

<div class="post-tip">
  💡 퇴직 후 건강보험료가 갑자기 올라서 부담이셨다면, 취업하면 직장가입자로 전환되어 보험료가 줄어드는 경우가 많습니다. 일하는 게 보험료 면에서도 유리할 수 있어요.
</div>

<h3>국민연금은 계속 내야 하나요?</h3>
<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
60세 미만이시면 직장 들어가면 다시 납부 대상이 돼요.<br>
60세 이후면 국민연금 납부 의무는 없고, 원하면 임의계속가입으로 더 낼 수 있어요 (연금액이 늘어납니다).
</p>

<h3>체크리스트</h3>
<div style="background:#F0FDF4;border-radius:10px;padding:20px;margin:20px 0;">
  ✅ 주 15시간 이상 일하면 4대보험 적용<br>
  ✅ 산재보험은 직원이 1원도 안 냄 (회사 전액 부담)<br>
  ✅ 직장 들어가면 지역가입 건강보험은 자동 종료<br>
  ✅ 국민연금은 60세 미만이면 자동 적용, 60세 이후엔 선택<br>
  ✅ 4대보험 가입 여부는 계약 전에 사업주에게 확인하면 됨
</div>

<p style="font-size:1.05rem;line-height:1.9;color:#374151;">
"왜 이렇게 떼가냐"고 억울하셨던 분들, 이제 조금 이해가 되셨으면 해요.<br>
내가 낸 돈이 결국 내 노후와 건강을 위한 돈이기도 하니까요.
</p>
    `
  }
];
