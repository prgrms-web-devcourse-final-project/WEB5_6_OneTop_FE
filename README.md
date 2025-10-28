# 🌌 Re:Life

> **"만약 그때 다른 선택을 했다면?"**  
> AI가 시뮬레이션하는 평행우주적 인생 시나리오 서비스

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5.89.0-FF4154?style=flat-square&logo=react-query)](https://tanstack.com/query)

---

## 📖 프로젝트 소개

**Re:Life**는 사용자의 과거 인생 선택을 기반으로, AI가 "만약 그때 다른 선택을 했다면?"이라는 평행우주적 인생 시나리오를 시뮬레이션하여 제공하는 웹 서비스입니다.

단순한 재미를 넘어, 실제 사회 통계와 개인 성향 데이터를 반영하여 **현실적이고 구체적인 대안적 삶**을 탐색할 수 있도록 설계되었습니다.

### 🎯 핵심 가치

- **과거 선택에 대한 후회 완화**
- **현재 삶의 만족도 향상**
- **미래 의사결정 지원**

---

## ✨ 주요 기능

### 🔄 인생 분기점 기록 시스템
- 타임라인 기반으로 중요한 선택(교육, 직업, 관계 등) 기록
- 게스트 모드에서는 분기점 기록 횟수 제한

### 🤖 AI 평행우주 시뮬레이션
- 입력된 분기점을 기반으로 대체 선택 시 인생 시나리오 생성
- 시나리오 결과에 대한 AI 생성 이미지 제공
- 게스트 모드에서는 대체 선택 시뮬레이션 횟수 제한

### 📊 비교 & 분석 도구
- 현재 삶과 가상 삶을 **시각화** (그래프, 레이더 차트, 타임라인)
- 경제·관계·건강·직업·행복 지표 제공

### 👥 소셜 & 커뮤니티 기능
- "A vs B 선택" 투표
- 시나리오 공유
- 일반 게시판

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4.1.13
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query 5.89.0
- **HTTP Client**: Axios 1.12.2
- **Form Handling**: React Hook Form 7.63.0
- **Validation**: Zod 4.1.1 1

### UI/UX
- **3D Graphics**: Three.js 0.180.0
- **Charts**: Recharts 3.2.1
- **Flow Diagrams**: XYFlow React 12.8.5
- **Animations**: GSAP 3.13.0, Lottie React 2.4.1
- **Editor**: Toast UI Editor 3.2.2
- **Icons**: React Icons 5.5.0

### Backend Integration
- **Authentication**: OAuth2 with SpringSecurity
- **AI Integration**: Gemini API
- **Security**: CSRF Sync 4.2.1

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm, yarn, pnpm 또는 bun

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/relife_fe.git
   cd relife_fe
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   # 또는
   pnpm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   yarn dev
   # 또는
   pnpm dev
   ```

4. **브라우저에서 확인**
   
   [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint
```

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # 메인 페이지
│   ├── (protected)/       # 인증이 필요한 페이지
│   ├── (public)/          # 공개 페이지
│   └── api/               # API 라우트
├── domains/               # 도메인별 비즈니스 로직
│   ├── auth/              # 인증 관련
│   ├── baselines/         # 인생 분기점
│   ├── community/         # 커뮤니티
│   ├── multiverse/        # 평행우주 시뮬레이션
│   ├── my-page/           # 마이페이지
│   ├── onboarding/        # 온보딩
│   ├── scenarios/         # 시나리오 관리
│   └── scenario-list/     # 시나리오 목록
├── share/                 # 공통 컴포넌트 및 유틸리티
│   ├── components/        # 공통 컴포넌트
│   ├── hooks/             # 공통 훅
│   ├── providers/         # 프로바이더
│   ├── styles/            # 글로벌 스타일
│   └── utils/             # 유틸리티 함수
└── types/                 # 타입 정의
```

---

## 🎨 디자인 시스템

프로젝트의 UI/UX 디자인은 Figma에서 확인할 수 있습니다:

🔗 **[Figma 디자인 시스템](https://www.figma.com/design/1MVIz5kNa6P1mTPvoRFAcK/Re-Life?node-id=0-1&t=poQPLmAKeDGjTmRA-1)**

---

## 👥 팀 정보

### 협업 방식
- **브랜치 전략**: GitHub Flow
- **코드 리뷰**: Pull Request 기반
- **이슈 관리**: GitHub Issues
- **문서 관리**: Notion

---

## 🌟 주요 특징

### 🔐 인증 시스템
- 소셜 로그인 지원 (OAuth2)
- 게스트 모드 제공으로 진입 장벽 최소화
- JSESSION 기반 토큰 인증
- CSRF 이중화 인증 시스템

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 최적화
- Progressive Web App (PWA) 지원

### 🎯 사용자 경험
- 직관적인 타임라인 인터페이스
- 실시간 시뮬레이션 진행 상태 표시
- 인터랙티브한 3D 시각화

### 🔄 상태 관리
- Zustand를 활용한 경량 상태 관리
- TanStack Query를 통한 서버 상태 최적화
- 로컬 스토리지 기반 데이터 영속성

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 📞 문의

프로젝트에 대한 문의사항이나 제안이 있으시면 언제든 연락해주세요!

- **이슈 등록**: [GitHub Issues](https://github.com/your-username/relife_fe/issues)
- **이메일**: dbseodnd356@gmail.com

---

<div align="center">

**🌌 Re:Life - 당신의 평행우주를 탐험해보세요 🌌**

Made with ❤️ by Re:Life Team